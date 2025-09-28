import Vue from 'vue'
import Vuex from 'vuex'
import { storeLocalConfig } from '@/api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isHandleLocalFile: false, // Whether operating on local files // 是否操作的是本地文件
    localConfig: {
      // Local configuration // 本地配置
      isZenMode: false, // Whether in zen mode // 是否是禅模式
      // Whether to enable rich text for nodes // 是否开启节点富文本
      openNodeRichText: true,
      // Mouse behavior // 鼠标行为
      useLeftKeySelectionRightKeyDrag: false,
      // Whether to show scrollbar // 是否显示滚动条
      isShowScrollbar: false,
      // Whether in dark mode // 是否是暗黑模式
      isDark: false,
      // Whether to enable AI features // 是否开启AI功能
      enableAi: true
    },
    activeSidebar: '', // Currently displayed sidebar // 当前显示的侧边栏
    isOutlineEdit: false, // Whether in outline edit mode // 是否是大纲编辑模式
    isReadonly: false, // Whether read-only // 是否只读
    isSourceCodeEdit: false, // Whether in source code edit mode // 是否是源码编辑模式
    extraTextOnExport: '', // Text added at the bottom when exporting // 导出时底部添加的文字
    isDragOutlineTreeNode: false, // Whether currently dragging a node in the outline tree // 当前是否正在拖拽大纲树的节点
    aiConfig: {
      api: 'http://ark.cn-beijing.volces.com/api/v3/chat/completions',
      key: '',
      model: '',
      port: 3456,
      method: 'POST'
    },
    // Extension theme list // 扩展主题列表
    extendThemeGroupList: [],
    // Built-in background images // 内置背景图片
    bgList: []
  },
  mutations: {
    // Set the flag for operating local files // 设置操作本地文件标志位
    setIsHandleLocalFile(state, data) {
      state.isHandleLocalFile = data
    },

    // Set local configuration // 设置本地配置
    setLocalConfig(state, data) {
      const aiConfigKeys = Object.keys(state.aiConfig)
      Object.keys(data).forEach(key => {
        if (aiConfigKeys.includes(key)) {
          state.aiConfig[key] = data[key]
        } else {
          state.localConfig[key] = data[key]
        }
      })
      storeLocalConfig({
        ...state.localConfig,
        ...state.aiConfig
      })
    },

    // Set currently displayed sidebar // 设置当前显示的侧边栏
    setActiveSidebar(state, data) {
      state.activeSidebar = data
    },

    // Set outline edit mode // 设置大纲编辑模式
    setIsOutlineEdit(state, data) {
      state.isOutlineEdit = data
    },

    // Set read-only mode // 设置是否只读
    setIsReadonly(state, data) {
      state.isReadonly = data
    },

    // Set source code edit mode // 设置源码编辑模式
    setIsSourceCodeEdit(state, data) {
      state.isSourceCodeEdit = data
    },

    // Set text added at the bottom when exporting // 设置导出时底部添加的文字
    setExtraTextOnExport(state, data) {
      state.extraTextOnExport = data
    },

    // Set tree node dragging // 设置树节点拖拽
    setIsDragOutlineTreeNode(state, data) {
      state.isDragOutlineTreeNode = data
    },

    // Set extension theme list // 扩展主题列表
    setExtendThemeGroupList(state, data) {
      state.extendThemeGroupList = data
    },

    // Set background image list // 设置背景图片列表
    setBgList(state, data) {
      state.bgList = data
    }
  },
  actions: {}
})

export default store
