<template>
  <Sidebar ref="sidebar" :title="$t('ai.chatTitle')">
    <div class="aiChatBox" :class="{ isDark: isDark }">
      <!-- Provider Info Bar -->
      <div class="provider-info" :class="{ 'has-error': hasError }">
        <span class="provider-name">
          <i class="el-icon-cpu"></i>
          {{ currentProviderName }}
          <span class="model-name" v-if="aiConfig.model">({{ aiConfig.model }})</span>
        </span>
        <span class="status" v-if="isCreating">
          <i class="el-icon-loading"></i>
          {{ $t('ai.generating') }}
        </span>
        <span class="error-msg" v-if="errorMessage">
          <i class="el-icon-warning-outline"></i>
          {{ errorMessage }}
        </span>
      </div>
      
      <div class="chatHeader">
        <el-button size="mini" @click="clear" :disabled="isCreating">
          <i class="el-icon-delete"></i>
          {{ $t('ai.clearRecords') }}
        </el-button>
        <el-button size="mini" @click="modifyAiConfig" :disabled="isCreating">
          <i class="el-icon-setting"></i>
          {{ $t('ai.settings') }}
        </el-button>
      </div>
      
      <!-- Chat Messages -->
      <div class="chatResBox customScrollbar" ref="chatResBoxRef">
        <div v-if="chatList.length === 0" class="welcome-message">
          <div class="welcome-content">
            <div class="welcome-icon">
              <i class="el-icon-chat-dot-round"></i>
            </div>
            <h3>{{ $t('ai.welcomeTitle') }}</h3>
            <p>{{ $t('ai.welcomeSubtitle') }}</p>
            <div class="suggestions">
              <el-button 
                v-for="(suggestion, index) in suggestions" 
                :key="index"
                size="small"
                @click="useSuggestion(suggestion)"
              >
                {{ suggestion }}
              </el-button>
            </div>
          </div>
        </div>
        
        <div
          v-else
          class="chatItem"
          v-for="item in chatList"
          :key="item.id"
          :class="[item.type]"
        >
          <div class="chatItemInner" v-if="item.type === 'user'">
            <div class="avatar user-avatar">
              <i class="el-icon-user"></i>
            </div>
            <div class="content">
              <div class="message-text">{{ item.content }}</div>
              <div class="message-time">{{ formatTime(item.time) }}</div>
            </div>
          </div>
          <div class="chatItemInner" v-else-if="item.type === 'ai'">
            <div class="avatar ai-avatar">
              <i class="el-icon-cpu"></i>
            </div>
            <div class="content">
              <div class="message-text" v-html="item.content"></div>
              <div class="message-time">
                {{ formatTime(item.time) }}
                <span class="copy-btn" @click="copyToClipboard(item.content)">
                  <i class="el-icon-document-copy"></i>
                  {{ $t('ai.copy') }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="isCreating && chatList[chatList.length - 1]?.type === 'ai'" class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
      
      <!-- Input Area -->
      <div class="chatInputBox" :class="{ 'has-error': hasError }">
        <div class="input-wrapper">
          <el-input
            type="textarea"
            :rows="3"
            resize="none"
            v-model="text"
            :placeholder="$t('ai.chatInputPlaceholder')"
            @keydown.enter.native="handleKeydown"
            :disabled="isCreating"
          ></el-input>
          <div class="input-actions">
            <span class="hint" v-if="!isCreating">
              {{ $t('ai.pressEnterToSend') }}
            </span>
            <el-button 
              type="primary" 
              size="small" 
              @click="send" 
              :loading="isCreating"
              :disabled="!text.trim()"
              class="send-btn"
            >
              {{ isCreating ? $t('ai.generating') : $t('ai.send') }}
              <i :class="isCreating ? 'el-icon-loading' : 'el-icon-position'" class="send-icon"></i>
            </el-button>
          </div>
        </div>
        
        <div class="disclaimer">
          {{ $t('ai.disclaimer') }}
        </div>
      </div>
    </div>
  </Sidebar>
</template>

<script>
import Sidebar from './Sidebar.vue'
import { mapState } from 'vuex'
import { createUid } from 'simple-mind-map/src/utils'
import MarkdownIt from 'markdown-it'
import { AI_PROVIDERS } from '@/config/ai'

let md = null

export default {
  name: 'AiChat',
  components: {
    Sidebar
  },
  data() {
    return {
      text: '',
      chatList: [],
      isCreating: false,
      errorMessage: '',
      suggestions: [
        this.$t('ai.suggestions.help'),
        this.$t('ai.suggestions.summarize'),
        this.$t('ai.suggestions.brainstorm')
      ]
    }
  },
  computed: {
    ...mapState({
      isDark: state => state.localConfig.isDark,
      activeSidebar: state => state.activeSidebar,
      aiConfig: state => state.localConfig.aiConfig || {}
    }),
    currentProviderName() {
      const provider = this.aiConfig.provider || 'volcano'
      const providerInfo = AI_PROVIDERS[provider] || {}
      return providerInfo.name || this.$t('ai.unknownProvider')
    },
    hasError() {
      return !!this.errorMessage
    }
  },
  watch: {
    activeSidebar(val) {
      this.$refs.sidebar.show = val === 'ai'
      if (val === 'ai') {
        this.scrollToBottom()
      }
    },
    chatList: {
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      },
      deep: true
    }
  },
  created() {
    // Initialize markdown parser
    md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true
    })
    
    // Load chat history from local storage
    this.loadChatHistory()
    
    // Listen for AI chat events
    this.$bus.$on('ai_chat', this.handleAiChat)
    this.$bus.$on('ai_chat_stop', this.handleAiChatStop)
  },
  beforeDestroy() {
    // Clean up event listeners
    this.$bus.$off('ai_chat', this.handleAiChat)
    this.$bus.$off('ai_chat_stop', this.handleAiChatStop)
  },
  methods: {
    handleKeydown(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        this.send()
      }
    },
    
    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    
    async copyToClipboard(text) {
      try {
        // Remove HTML tags for plain text copy
        const plainText = text.replace(/<[^>]*>/g, '')
        await navigator.clipboard.writeText(plainText)
        this.$message.success(this.$t('ai.copiedToClipboard'))
      } catch (err) {
        console.error('Failed to copy text:', err)
        this.$message.error(this.$t('ai.copyFailed'))
      }
    },
    
    useSuggestion(suggestion) {
      this.text = suggestion
      this.$nextTick(() => {
        const textarea = this.$el.querySelector('textarea')
        if (textarea) textarea.focus()
      })
    },
    
    scrollToBottom() {
      if (this.$refs.chatResBoxRef) {
        this.$refs.chatResBoxRef.scrollTop = this.$refs.chatResBoxRef.scrollHeight
      }
    },
    
    saveChatHistory() {
      try {
        localStorage.setItem('aiChatHistory', JSON.stringify(this.chatList))
      } catch (e) {
        console.error('Failed to save chat history:', e)
      }
    },
    
    loadChatHistory() {
      try {
        const saved = localStorage.getItem('aiChatHistory')
        if (saved) {
          this.chatList = JSON.parse(saved)
        }
      } catch (e) {
        console.error('Failed to load chat history:', e)
      }
    },
    
    async send() {
      if (this.isCreating) return
      
      const text = this.text.trim()
      if (!text) return
      
      // Clear any previous error
      this.errorMessage = ''
      
      // Add user message to chat
      const userMessage = {
        id: createUid(),
        type: 'user',
        content: text,
        time: Date.now()
      }
      
      // Add AI placeholder message
      const aiMessage = {
        id: createUid(),
        type: 'ai',
        content: '',
        time: Date.now()
      }
      
      this.chatList = [...this.chatList, userMessage, aiMessage]
      this.text = ''
      this.isCreating = true
      
      try {
        // Prepare messages for the AI
        const messages = this.prepareMessages(text)
        
        // Emit the chat event with provider info
        this.$bus.$emit('ai_chat', {
          provider: this.aiConfig.provider || 'volcano',
          model: this.aiConfig.model,
          messages,
          onData: (content) => {
            // Update the last AI message with streaming content
            const lastMessage = this.chatList[this.chatList.length - 1]
            if (lastMessage && lastMessage.type === 'ai') {
              lastMessage.content = md.render(content)
              lastMessage.time = Date.now()
              this.$forceUpdate()
            }
          },
          onComplete: () => {
            this.isCreating = false
            this.saveChatHistory()
          },
          onError: (error) => {
            this.isCreating = false
            this.errorMessage = error.message || this.$t('ai.generationFailed')
            this.$message.error(this.errorMessage)
          }
        })
      } catch (error) {
        console.error('Error sending message:', error)
        this.isCreating = false
        this.errorMessage = error.message || this.$t('ai.unexpectedError')
        this.$message.error(this.errorMessage)
      }
    },
    
    prepareMessages(newMessage) {
      // Get the conversation history
      const history = this.chatList
        .filter(msg => msg.type === 'user' || msg.type === 'ai')
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content.replace(/<[^>]*>/g, '') // Remove HTML tags
        }))
      
      // Add the new user message
      history.push({
        role: 'user',
        content: newMessage
      })
      
      return history
    },
    
    handleAiChat(options) {
      const {
        provider = 'volcano',
        model = '',
        messages = [],
        onData,
        onComplete,
        onError
      } = options
      
      // Get the current AI config
      const aiConfig = this.$store.state.localConfig.aiConfig || {}
      
      // Prepare the request data
      const requestData = {
        provider,
        model: model || aiConfig.model,
        apiKey: aiConfig.apiKey,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: aiConfig.temperature,
        maxTokens: aiConfig.maxTokens,
        topP: aiConfig.topP,
        presencePenalty: aiConfig.presencePenalty,
        frequencyPenalty: aiConfig.frequencyPenalty
      }
      
      // Make the API request
      this.$http.post('/api/ai/chat', requestData, {
        responseType: 'stream',
        onDownloadProgress: (progressEvent) => {
          const response = progressEvent.target.response
          const lines = response.split('\n').filter(line => line.trim() !== '')
          
          for (const line of lines) {
            try {
              const message = line.replace(/^data: /, '').trim()
              if (message === '[DONE]') {
                if (onComplete) onComplete()
                return
              }
              
              const parsed = JSON.parse(message)
              if (parsed.choices && parsed.choices[0].delta.content) {
                const content = parsed.choices[0].delta.content
                if (onData) onData(content)
              }
            } catch (e) {
              console.error('Error parsing SSE message:', e)
            }
          }
        }
      }).catch(error => {
        console.error('AI API error:', error)
        const errorMessage = error.response?.data?.error?.message || error.message || this.$t('ai.generationFailed')
        if (onError) onError(new Error(errorMessage))
      })
    },
    
    handleAiChatStop() {
      // Abort any ongoing requests if possible
      if (this.currentRequest) {
        this.currentRequest.abort()
        this.currentRequest = null
      }
      this.isCreating = false
    },
    
    clear() {
      this.$confirm(this.$t('ai.clearChatConfirm'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.chatList = []
        localStorage.removeItem('aiChatHistory')
        this.$message({
          type: 'success',
          message: this.$t('ai.chatCleared')
        })
      }).catch(() => {})
    },
    
    modifyAiConfig() {
      this.$bus.$emit('showAiConfigDialog')
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/styles/variables.less';

.aiChatBox {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  position: relative;
  
  // Provider info bar
  .provider-info {
    padding: 8px 16px;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    color: #495057;
    
    &.has-error {
      background-color: #fff3f3;
      color: #dc3545;
    }
    
    .provider-name {
      display: flex;
      align-items: center;
      font-weight: 500;
      
      i {
        margin-right: 6px;
        font-size: 14px;
      }
      
      .model-name {
        margin-left: 6px;
        opacity: 0.8;
        font-weight: normal;
      }
    }
    
    .status {
      color: #0d6efd;
      display: flex;
      align-items: center;
      
      i {
        margin-right: 4px;
        animation: rotating 2s linear infinite;
      }
    }
    
    .error-msg {
      display: flex;
      align-items: center;
      
      i {
        margin-right: 4px;
      }
    }
  }

  .chatHeader {
    height: 56px;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    align-items: center;
    padding: 0 16px;
    background-color: #fff;
    z-index: 1;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
    
    .el-button {
      margin-right: 8px;
      
      i {
        font-size: 14px;
        margin-right: 4px;
      }
    }
  }

  .chatResBox {
    flex: 1;
    width: 100%;
    padding: 16px;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #fff;
    
    // Welcome message
    .welcome-message {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #6c757d;
      
      .welcome-content {
        max-width: 400px;
        margin: 0 auto;
        padding: 20px;
        
        .welcome-icon {
          font-size: 48px;
          color: #e9ecef;
          margin-bottom: 16px;
        }
        
        h3 {
          margin: 0 0 8px;
          color: #343a40;
          font-weight: 500;
        }
        
        p {
          margin: 0 0 20px;
          line-height: 1.5;
        }
        
        .suggestions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          
          .el-button {
            justify-content: flex-start;
            padding: 10px 16px;
            text-align: left;
            white-space: normal;
            height: auto;
            line-height: 1.4;
            border-radius: 8px;
            border: 1px solid #e9ecef;
            background-color: #f8f9fa;
            color: #495057;
            
            &:hover {
              background-color: #e9ecef;
              border-color: #dee2e6;
            }
          }
        }
      }
    }
    
    // Chat items
    .chatItem {
      margin-bottom: 24px;
      position: relative;
      animation: fadeIn 0.3s ease-out;
      
      &:last-of-type {
        margin-bottom: 0;
      }
      
      // User message
      &.user {
        .chatItemInner {
          flex-direction: row-reverse;
          
          .content {
            margin-left: 0;
            margin-right: 12px;
            align-items: flex-end;
            
            .message-text {
              background-color: #e3f2fd;
              color: #0d47a1;
              border-top-right-radius: 0;
              
              &::before {
                content: '';
                position: absolute;
                top: 0;
                right: -8px;
                width: 0;
                height: 0;
                border-style: solid;
                border-width: 0 0 12px 12px;
                border-color: transparent transparent #e3f2fd transparent;
              }
            }
          }
          
          .user-avatar {
            background-color: #1976d2;
            color: #fff;
          }
        }
      }
      
      // AI message
      &.ai {
        .chatItemInner {
          .content {
            .message-text {
              background-color: #f5f5f5;
              color: #212121;
              border-top-left-radius: 0;
              
              &::before {
                content: '';
                position: absolute;
                top: 0;
                left: -8px;
                width: 0;
                height: 0;
                border-style: solid;
                border-width: 0 12px 12px 0;
                border-color: transparent #f5f5f5 transparent transparent;
              }
              
              /deep/ pre {
                background-color: rgba(0, 0, 0, 0.05);
                border-radius: 4px;
                padding: 12px;
                overflow-x: auto;
                margin: 8px 0;
                
                code {
                  font-family: 'Fira Code', 'Consolas', monospace;
                  font-size: 13px;
                  line-height: 1.5;
                }
              }
              
              /deep/ code:not(pre code) {
                background-color: rgba(0, 0, 0, 0.05);
                padding: 2px 4px;
                border-radius: 3px;
                font-size: 0.9em;
                font-family: 'Fira Code', 'Consolas', monospace;
              }
              
              /deep/ a {
                color: #1976d2;
                text-decoration: none;
                
                &:hover {
                  text-decoration: underline;
                }
              }
              
              /deep/ blockquote {
                margin: 8px 0;
                padding: 8px 12px;
                border-left: 4px solid #e0e0e0;
                background-color: rgba(0, 0, 0, 0.02);
                color: #616161;
                font-style: italic;
              }
              
              /deep/ table {
                border-collapse: collapse;
                width: 100%;
                margin: 12px 0;
                
                th, td {
                  border: 1px solid #e0e0e0;
                  padding: 8px 12px;
                  text-align: left;
                }
                
                th {
                  background-color: #f5f5f5;
                  font-weight: 500;
                }
              }
            }
          }
          
          .ai-avatar {
            background-color: #616161;
            color: #fff;
          }
        }
      }

      &.ai {
        border-color: #409eff;

        .chatItemInner {
          .avatar {
            border-color: #409eff;
            left: -12px;
            top: -12px;

            .icon {
              color: #409eff;
            }
          }
        }
      }

      &.user {
        border-color: #f56c6c;

        .chatItemInner {
          .avatar {
            border-color: #f56c6c;
            right: -12px;
            top: -12px;

            .icon {
              color: #f56c6c;
            }
          }
        }
      }

      .chatItemInner {
        width: 100%;
        padding: 12px;

        .avatar {
          width: 30px;
          height: 30px;
          border: 1px solid;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: absolute;
          background-color: #fff;

          .icon {
            font-size: 18px;
            font-weight: bold;
          }
        }

        /deep/ .content {
          width: 100%;
          overflow: hidden;
          color: #3f4a54;
          font-size: 14px;
          line-height: 1.5;

          p {
            margin-bottom: 12px;

            &:last-of-type {
              margin-bottom: 0;
            }
          }

          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            margin-top: 24px;
            margin-bottom: 16px;
          }

          code {
            padding: 0.2em 0.4em;
            margin: 0;
            font-size: 85%;
            white-space: break-spaces;
            background-color: rgba(175, 184, 193, 0.2);
            border-radius: 6px;
            font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas,
              Liberation Mono, monospace;
          }

          pre {
            padding: 12px;
            background-color: rgba(175, 184, 193, 0.2);

            code {
              background-color: transparent;
              padding: 0;
              overflow: hidden;
            }
          }
        }
      }
    }
  }

  .chatInputBox {
    flex-shrink: 0;
    width: 100%;
    padding: 16px;
    background-color: #fff;
    border-top: 1px solid #e9ecef;
    position: relative;
    box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.03);
    
    &.has-error {
      .input-wrapper {
        border-color: #ff4d4f;
        box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.1);
      }
    }
    
    .input-wrapper {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      transition: all 0.3s;
      background-color: #fff;
      
      &:focus-within {
        border-color: #1976d2;
        box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
      }
      
      /deep/ .el-textarea__inner {
        border: none;
        border-radius: 0;
        padding: 12px 16px;
        font-size: 14px;
        line-height: 1.5;
        resize: none;
        min-height: 80px !important;
        max-height: 200px;
        box-shadow: none;
        
        &::placeholder {
          color: #9e9e9e;
        }
        
        &:focus {
          box-shadow: none;
        }
      }
    }
    
    .input-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background-color: #fafafa;
      border-top: 1px solid #f0f0f0;
      
      .hint {
        font-size: 12px;
        color: #9e9e9e;
      }
      
      .send-btn {
        padding: 6px 16px;
        font-weight: 500;
        transition: all 0.2s;
        
        .send-icon {
          margin-left: 4px;
          transition: transform 0.2s;
        }
        
        &:hover:not(:disabled) {
          transform: translateY(-1px);
          
          .send-icon {
            transform: translateX(2px);
          }
        }
        
        &:active:not(:disabled) {
          transform: translateY(0);
        }
      }
    }
    
    .disclaimer {
      font-size: 11px;
      color: #9e9e9e;
      text-align: center;
      margin-top: 8px;
      line-height: 1.4;
    }
  }
  
  // Dark mode styles
  &.isDark {
    background-color: #1e1e1e;
    color: #e0e0e0;
    
    .provider-info {
      background-color: #252525;
      border-bottom-color: #333;
      color: #b0b0b0;
      
      &.has-error {
        background-color: #2a1a1a;
        color: #ff6b6b;
      }
      
      .status {
        color: #64b5f6;
      }
    }
    
    .chatHeader {
      background-color: #252525;
      border-bottom-color: #333;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
    
    .chatResBox {
      background-color: #1e1e1e;
      
      .welcome-message {
        color: #9e9e9e;
        
        h3 {
          color: #e0e0e0;
        }
        
        .suggestions {
          .el-button {
            background-color: #2d2d2d;
            border-color: #3d3d3d;
            color: #b0b0b0;
            
            &:hover {
              background-color: #333;
              border-color: #444;
            }
          }
        }
      }
      
      .chatItem {
        &.user {
          .chatItemInner {
            .content {
              .message-text {
                background-color: #2c3e50;
                color: #e0e0e0;
                
                &::before {
                  border-color: transparent transparent #2c3e50 transparent;
                }
              }
            }
            
            .user-avatar {
              background-color: #1e88e5;
              color: #fff;
            }
          }
        }
        
        &.ai {
          .chatItemInner {
            .content {
              .message-text {
                background-color: #2d2d2d;
                color: #e0e0e0;
                
                &::before {
                  border-color: transparent #2d2d2d transparent transparent;
                }
                
                /deep/ pre {
                  background-color: rgba(0, 0, 0, 0.3);
                  
                  code {
                    color: #e0e0e0;
                  }
                }
                
                /deep/ code:not(pre code) {
                  background-color: rgba(255, 255, 255, 0.1);
                  color: #f48fb1;
                }
                
                /deep/ a {
                  color: #64b5f6;
                }
                
                /deep/ blockquote {
                  border-left-color: #555;
                  background-color: rgba(255, 255, 255, 0.03);
                  color: #aaa;
                }
                
                /deep/ table {
                  th, td {
                    border-color: #444;
                  }
                  
                  th {
                    background-color: #2d2d2d;
                  }
                  
                  tr:nth-child(2n) {
                    background-color: rgba(255, 255, 255, 0.03);
                  }
                }
              }
            }
            
            .ai-avatar {
              background-color: #555;
              color: #e0e0e0;
            }
          }
        }
      }
    }
    
    .chatInputBox {
      background-color: #252525;
      border-top-color: #333;
      box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.3);
      
      .input-wrapper {
        background-color: #2d2d2d;
        border-color: #3d3d3d;
        
        &:focus-within {
          border-color: #64b5f6;
          box-shadow: 0 0 0 2px rgba(100, 181, 246, 0.2);
        }
        
        /deep/ .el-textarea__inner {
          background-color: transparent;
          color: #e0e0e0;
          
          &::placeholder {
            color: #6c757d;
          }
        }
      }
      
      .input-actions {
        background-color: #252525;
        border-top-color: #333;
        
        .hint {
          color: #6c757d;
        }
      }
      
      .disclaimer {
        color: #6c757d;
      }
    }
  }
}

// Animations
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// Typing indicator
.typing-indicator {
  display: flex;
  justify-content: center;
  padding: 12px 0;
  
  .typing-dot {
    width: 8px;
    height: 8px;
    margin: 0 4px;
    background-color: #9e9e9e;
    border-radius: 50%;
    display: inline-block;
    animation: typing 1.4s infinite ease-in-out both;
    
    &:nth-child(1) {
      animation-delay: -0.32s;
    }
    
    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }
}

@keyframes typing {
  0%, 80%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  40% {
    transform: translateY(-6px);
    opacity: 1;
  }
}
</style>
