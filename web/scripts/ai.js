const express = require('express')
const axios = require('axios')
const net = require('net')

const port = 3456

const isPortUsed = port => {
  return new Promise(resolve => {
    const server = net.createServer()
    server.once('error', err => {
      if (err.code === 'EADDRINUSE') {
        resolve(true) // 端口被占用
      } else {
        resolve(false) // 其他错误
      }
    })
    server.once('listening', () => {
      server.close(() => resolve(false)) // 端口可用
    })
    server.listen(port) // 尝试监听端口
  })
}

const createServe = () => {
  // 起个服务
  const app = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // 允许跨域
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*') // 允许所有来源的跨域请求，或者指定一个域名
    res.header('Access-Control-Allow-Methods', '*') // 允许的方法
    res.header('Access-Control-Allow-Headers', '*') // 允许的头部信息
    next()
  })

  // 监听对话请求
  app.get('/ai/test', (req, res) => {
    res
      .json({
        code: 0,
        data: null,
        msg: '连接成功'
      })
      .end()
  })
  // 获取支持的AI提供商配置
  const getProviderConfig = (type) => {
    const config = {
      openai: {
        baseUrl: 'https://api.openai.com/v1',
        defaultModel: 'gpt-3.5-turbo',
        headers: (apiKey) => ({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        })
      },
      volcano: {
        baseUrl: 'https://ark.cn-beijing.volces.com',
        defaultModel: 'volc-ark',
        headers: (apiKey) => ({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        })
      },
      deepseek: {
        baseUrl: 'https://api.deepseek.com/v1',
        defaultModel: 'deepseek-chat',
        headers: (apiKey) => ({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        })
      }
    }
    return config[type] || null
  }

  // 处理不同提供商的请求
  const handleProviderRequest = async (provider, options) => {
    const config = getProviderConfig(provider)
    if (!config) {
      throw new Error(`Unsupported AI provider: ${provider}`)
    }

    const { apiKey, model, messages, temperature = 0.7, maxTokens = 2000 } = options
    
    const requestConfig = {
      url: provider === 'volcano' ? options.api : `${config.baseUrl}/chat/completions`,
      method: 'POST',
      headers: {
        ...config.headers(apiKey),
        ...(options.headers || {})
      },
      data: {
        model: model || config.defaultModel,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream: true
      },
      responseType: 'stream'
    }

    // 火山引擎的特殊处理
    if (provider === 'volcano' && options.data) {
      requestConfig.data = {
        ...requestConfig.data,
        ...options.data
      }
    }

    return axios(requestConfig)
  }

  // AI聊天接口
  app.post('/ai/chat', async (req, res, next) => {
    // 设置SSE响应头
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('X-Accel-Buffering', 'no') // 禁用Nginx缓冲

    const { provider = 'volcano', apiKey, model, messages, prompt, ...rest } = req.body.data || {}
    
    try {
      // 如果有直接传递的API配置，则使用直接配置
      if (req.body.api) {
        const { api, method = 'POST', headers = {}, data } = req.body
        const response = await axios({
          url: api,
          method,
          headers,
          data,
          responseType: 'stream'
        })
        response.data.pipe(res)
      } else {
        // 否则使用提供商配置
        const formattedMessages = messages || [
          { role: 'user', content: prompt || '' }
        ]
        
        const response = await handleProviderRequest(provider, {
          apiKey,
          model,
          messages: formattedMessages,
          ...rest
        })
        
        // 将流式响应转发给客户端
        response.data.on('data', chunk => {
          res.write(chunk)
        })
        
        response.data.on('end', () => {
          res.end()
        })
        
        // 处理错误
        response.data.on('error', (err) => {
          console.error('Stream error:', err)
          if (!res.headersSent) {
            res.status(500).json({ error: 'Stream error', details: err.message })
          }
          res.end()
        })
      }
    } catch (error) {
      console.error('AI API Error:', error.response?.data || error.message)
      
      if (!res.headersSent) {
        const status = error.response?.status || 500
        const message = error.response?.data?.error?.message || error.message || 'AI服务请求失败'
        
        res.status(status).json({
          error: 'AI服务错误',
          message,
          details: error.response?.data || {}
        })
      }
      
      res.end()
    }
  })

  app.listen(port, () => {
    console.log(`app listening on port ${port}`)
  })
}

isPortUsed(port).then(isUsed => {
  if (isUsed) {
    console.error('端口被占用')
  } else {
    createServe()
  }
})
