class Ai {
  constructor(options = {}) {
    this.options = options
    this.provider = null
    this.baseData = {}
    this.controller = null
    this.currentChunk = ''
    this.content = ''
  }

  init(type = 'volcano', options = {}) {
    this.provider = type
    
    switch (type) {
      case 'volcano':
        // Volcano Engine API
        this.baseData = {
          api: options.api,
          method: options.method || 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${options.key}`
          },
          data: {
            model: options.model || 'volc-ark',
            stream: true
          }
        }
        break
        
      case 'openai':
        // OpenAI API
        this.baseData = {
          api: options.api || 'https://api.openai.com/v1/chat/completions',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${options.key}`
          },
          data: {
            model: options.model || 'gpt-3.5-turbo',
            stream: true
          }
        }
        break
        
      case 'deepseek':
        // DeepSeek API
        this.baseData = {
          api: options.api || 'https://api.deepseek.com/v1/chat/completions',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${options.key}`
          },
          data: {
            model: options.model || 'deepseek-chat',
            stream: true
          }
        }
        break
        
      default:
        throw new Error(`Unsupported AI provider: ${type}`)
    }
  }

  async request(data, progress = () => {}, end = () => {}, err = () => {}) {
    try {
      const res = await this.postMsg(data)
      const decoder = new TextDecoder()
      while (1) {
        const { done, value } = await res.read()
        if (done) {
          return
        }
        // Get current chunk data
        const text = decoder.decode(value)
        // Process chunk data
        let chunk = this.handleChunkData(text)
        // Check for incomplete chunks, if any, merge with next chunk; otherwise process data
        if (this.currentChunk) continue
        let isEnd = false
        const list = chunk
          .split('\n')
          .filter(item => {
            isEnd = item.includes('[DONE]')
            return !!item && !isEnd
          })
          .map(item => {
            try {
              return JSON.parse(item.replace(/^data:/, ''))
            } catch (e) {
              console.error('Error parsing chunk:', item)
              return null
            }
          })
          .filter(Boolean) // Remove any null entries from parsing errors
        
        list.forEach(item => {
          if (this.provider === 'volcano') {
            // Volcano format
            this.content += item.choices
              .map(choice => choice.delta?.content || '')
              .join('')
          } else if (this.provider === 'openai' || this.provider === 'deepseek') {
            // OpenAI/DeepSeek format
            this.content += item.choices
              .map(choice => choice.delta?.content || '')
              .join('')
          }
        })
        progress(this.content)
        if (isEnd) {
          end(this.content)
        }
      }
    } catch (error) {
      console.log(error)
      // Manual stop request doesn't need to trigger error callback
      if (!(error && error.name === 'AbortError')) {
        err(error)
      }
    }
  }

  async postMsg(data) {
    this.controller = new AbortController()
    const requestData = {
      ...this.baseData,
      data: {
        ...this.baseData.data,
        ...data
      }
    }
    
    // Format messages based on provider requirements
    if (this.provider === 'openai' || this.provider === 'deepseek') {
      if (data.messages) {
        requestData.data.messages = data.messages
      } else if (data.prompt) {
        requestData.data.messages = [{
          role: 'user',
          content: data.prompt
        }]
      }
    }
    
    const res = await fetch(`http://localhost:${this.options.port}/ai/chat`, {
      signal: this.controller.signal,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
    
    if (res.status && res.status !== 200) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.message || 'Request failed')
    }
    
    return res.body.getReader()
  }

  handleChunkData(chunk) {
    chunk = chunk.trim()
    // If there is a previous chunk
    if (this.currentChunk) {
      chunk = this.currentChunk + chunk
      this.currentChunk = ''
    }
    // If 'done' exists, consider it a complete chunk and the last one
    if (chunk.includes('[DONE]')) {
      return chunk
    }
    // If the last character is not '}', the chunk is considered incomplete and saved for the next concatenation (this method is not rigorous but solves most scenarios)
    if (chunk[chunk.length - 1] !== '}') {
      this.currentChunk = chunk
    }
    return chunk
  }

  stop() {
    this.controller.abort()
    this.controller = new AbortController()
  }
}

export default Ai
