import Vue from 'vue'
import Vuex from 'vuex'
import { storeLocalConfig } from '@/api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isHandleLocalFile: false, // Whether operating on a local file
    localConfig: {
      // Local configuration
      isZenMode: false, // Whether in zen mode
      // Whether to enable rich text for nodes
      openNodeRichText: true,
      // Mouse behavior
      useLeftKeySelectionRightKeyDrag: false,
      // Whether to show scrollbar
      isShowScrollbar: false,
      // Whether in dark mode
      isDark: false,
      // Whether to enable AI features
      enableAi: true
    },
    activeSidebar: '', // Currently displayed sidebar
    isOutlineEdit: false, // Whether in outline edit mode
    isReadonly: false, // Whether read-only
    isSourceCodeEdit: false, // Whether in source code edit mode
    extraTextOnExport: '', // Text added at the bottom when exporting
    isDragOutlineTreeNode: false, // Whether currently dragging a node in the outline tree
    aiConfig: {
      // Provider can be 'volcano', 'openai', or 'deepseek'
      provider: 'volcano',
      // Common settings
      apiKey: '',
      model: '',
      port: 3456,
      // Provider-specific settings
      providers: {
        volcano: {
          api: 'http://ark.cn-beijing.volces.com/api/v3/chat/completions',
          method: 'POST',
          availableModels: [
            { id: 'volc-ark', name: 'Volcano Ark' },
            { id: 'volc-ark-2.0', name: 'Volcano Ark 2.0' }
          ]
        },
        openai: {
          api: 'https://api.openai.com/v1/chat/completions',
          method: 'POST',
          availableModels: [
            { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
            { id: 'gpt-4', name: 'GPT-4' },
            { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' }
          ]
        },
        deepseek: {
          api: 'https://api.deepseek.com/v1/chat/completions',
          method: 'POST',
          availableModels: [
            { id: 'deepseek-chat', name: 'DeepSeek Chat' },
            { id: 'deepseek-coder', name: 'DeepSeek Coder' }
          ]
        }
      },
      // Generation settings
      temperature: 0.7,
      maxTokens: 2000,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0
    },
    // Extended theme list
    extendThemeGroupList: [],
    // Built-in background images
    bgList: []
  },
  mutations: {
    // Set flag for operating on local file
    setIsHandleLocalFile(state, data) {
      state.isHandleLocalFile = data
    },

    // Set local configuration
    setLocalConfig(state, data) {
      const aiConfigKeys = Object.keys(state.aiConfig)
      const providerConfigKeys = ['provider', 'apiKey', 'model', 'temperature', 'maxTokens', 'topP', 'frequencyPenalty', 'presencePenalty']
      
      Object.keys(data).forEach(key => {
        if (aiConfigKeys.includes(key)) {
          // Handle direct AI config updates
          state.aiConfig[key] = data[key]
        } else if (providerConfigKeys.includes(key)) {
          // Handle AI provider config updates
          state.aiConfig[key] = data[key]
        } else {
          state.localConfig[key] = data[key]
        }
      })
      
      // Save to local storage
      storeLocalConfig({
        ...state.localConfig,
        aiConfig: state.aiConfig
      })
    },
    
    // Update AI configuration
    updateAiConfig(state, { key, value }) {
      if (key in state.aiConfig) {
        state.aiConfig[key] = value
      } else if (key === 'provider' && state.aiConfig.providers[value]) {
        // When changing provider, update the model to the first available model for that provider
        state.aiConfig.provider = value
        state.aiConfig.model = state.aiConfig.providers[value].availableModels[0]?.id || ''
      }
      
      // Save to local storage
      storeLocalConfig({
        ...state.localConfig,
        aiConfig: state.aiConfig
      })
    },

    // Set currently displayed sidebar
    setActiveSidebar(state, data) {
      state.activeSidebar = data
    },

    // Set outline edit mode
    setIsOutlineEdit(state, data) {
      state.isOutlineEdit = data
    },

    // Set read-only mode
    setIsReadonly(state, data) {
      state.isReadonly = data
    },

    // Set source code edit mode
    setIsSourceCodeEdit(state, data) {
      state.isSourceCodeEdit = data
    },

    // Set text to add at bottom when exporting
    setExtraTextOnExport(state, data) {
      state.extraTextOnExport = data
    },

    // Set tree node dragging
    setIsDragOutlineTreeNode(state, data) {
      state.isDragOutlineTreeNode = data
    },

    // Extended theme list
    setExtendThemeGroupList(state, data) {
      state.extendThemeGroupList = data
    },

    // Set background image list
    setBgList(state, data) {
      state.bgList = data
    }
  },
  actions: {}
})

export default store
