<template>
  <div>
    <!-- Client connection failure prompt popup -->
    <el-dialog
      class="clientTipDialog"
      :title="$t('ai.connectFailedTitle')"
      :visible.sync="clientTipDialogVisible"
      width="400px"
      append-to-body
    >
      <div class="tipBox">
        <p>{{ $t('ai.connectFailedTip') }}</p>
        <p>
          {{ $t('ai.connectFailedCheckTip1')
          }}<a
            href="https://pan.baidu.com/s/1huasEbKsGNH2Af68dvWiOg?pwd=3bp3"
            >{{ $t('ai.baiduNetdisk') }}</a
          >、<a href="https://github.com/wanglin2/mind-map/releases">Github</a>
        </p>
        <p>{{ $t('ai.connectFailedCheckTip2') }}</p>
        <P>{{ $t('ai.connectFailedCheckTip3') }}</P>
        <p>
          {{ $t('ai.connectFailedCheckTip4')
          }}<el-button size="small" @click="testConnect">{{
            $t('ai.connectionDetection')
          }}</el-button>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="clientTipDialogVisible = false">{{
          $t('ai.close')
        }}</el-button>
      </div>
    </el-dialog>
    <!-- AI content input popup -->
    <el-dialog
      class="createDialog"
      :title="$t('ai.createMindMapTitle')"
      :visible.sync="createDialogVisible"
      width="450px"
      append-to-body
    >
      <div class="inputBox">
        <el-input
          type="textarea"
          :rows="5"
          :placeholder="$t('ai.createTip')"
          v-model="aiInput"
        >
        </el-input>
        <div class="tip warning">
          {{ $t('ai.importantTip') }}
        </div>
        <div class="tip">
          {{ $t('ai.wantModifyAiConfigTip')
          }}<el-button size="small" @click="showAiConfigDialog">{{
            $t('ai.modifyAIConfiguration')
          }}</el-button>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAiCreateDialog">{{
          $t('ai.cancel')
        }}</el-button>
        <el-button type="primary" @click="doAiCreate">{{
          $t('ai.confirm')
        }}</el-button>
      </div>
    </el-dialog>
    <!-- Add a transparent overlay during AI generation to prevent user operations -->
    <div
      class="aiCreatingMask"
      ref="aiCreatingMaskRef"
      v-show="aiCreatingMaskVisible"
    >
      <el-button type="warning" class="btn" @click="stopCreate">{{
        $t('ai.stopGenerating')
      }}</el-button>
    </div>
    <AiConfigDialog v-model="aiConfigDialogVisible"></AiConfigDialog>
    <!-- AI Continuation -->
    <el-dialog
      class="createDialog"
      :title="$t('ai.aiCreatePart')"
      :visible.sync="createPartDialogVisible"
      width="450px"
      append-to-body
    >
      <div class="inputBox">
        <el-input type="textarea" :rows="5" v-model="aiPartInput"> </el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAiCreatePartDialog">{{
          $t('ai.cancel')
        }}</el-button>
        <el-button type="primary" @click="confirmAiCreatePart">{{
          $t('ai.confirm')
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Ai from '@/utils/ai'
import { transformMarkdownTo } from 'simple-mind-map/src/parse/markdownTo'
import {
  createUid,
  isUndef,
  checkNodeOuter,
  getStrWithBrFromHtml
} from 'simple-mind-map/src/utils'
import { mapState } from 'vuex'
import AiConfigDialog from './AiConfigDialog.vue'

export default {
  components: {
    AiConfigDialog
  },
  props: {
    mindMap: {
      type: Object
    }
  },
  data() {
    return {
      aiInstance: null,
      isAiCreating: false,
      aiCreatingContent: '',

      isLoopRendering: false,
      uidMap: {},
      latestUid: '',

      clientTipDialogVisible: false,
      createDialogVisible: false,
      aiInput: '',
      aiCreatingMaskVisible: false,
      aiConfigDialogVisible: false,

      mindMapDataCache: '',
      beingAiCreateNodeUid: '',

      createPartDialogVisible: false,
      aiPartInput: '',
      beingCreatePartNode: null
    }
  },
  computed: {
    ...mapState(['aiConfig'])
  },
  created() {
    this.$bus.$on('ai_create_all', this.aiCrateAll)
    this.$bus.$on('ai_create_part', this.showAiCreatePartDialog)
    this.$bus.$on('ai_chat', this.aiChat)
    this.$bus.$on('ai_chat_stop', this.aiChatStop)
    this.$bus.$on('showAiConfigDialog', this.showAiConfigDialog)
  },
  mounted() {
    document.body.appendChild(this.$refs.aiCreatingMaskRef)
  },
  beforeDestroy() {
    this.$bus.$off('ai_create_all', this.aiCrateAll)
    this.$bus.$off('ai_create_part', this.showAiCreatePartDialog)
    this.$bus.$off('ai_chat', this.aiChat)
    this.$bus.$off('ai_chat_stop', this.aiChatStop)
    this.$bus.$off('showAiConfigDialog', this.showAiConfigDialog)
  },
  methods: {
    // Show AI configuration modification popup
    showAiConfigDialog() {
      this.aiConfigDialogVisible = true
    },

    // Client connection detection
    async testConnect() {
      try {
        await fetch(`http://localhost:${this.aiConfig.port}/ai/test`, {
          method: 'GET'
        })
        this.$message.success(this.$t('ai.connectSuccessful'))
        this.clientTipDialogVisible = false
        this.createDialogVisible = true
      } catch (error) {
        console.log(error)
        this.$message.error(this.$t('ai.connectFailed'))
      }
    },

    // Check if AI is available
    async aiTest() {
      // Check configuration
      if (
        !(
          this.aiConfig.api &&
          this.aiConfig.key &&
          this.aiConfig.model &&
          this.aiConfig.port
        )
      ) {
        this.showAiConfigDialog()
        throw new Error(this.$t('ai.configurationMissing'))
      }
      // Check connection
      let isConnect = false
      try {
        await fetch(`http://localhost:${this.aiConfig.port}/ai/test`, {
          method: 'GET'
        })
        isConnect = true
      } catch (error) {
        console.log(error)
        this.clientTipDialogVisible = true
      }
      if (!isConnect) {
        throw new Error(this.$t('ai.connectFailed'))
      }
    },

    // Generate complete AI content
    async aiCrateAll() {
      try {
        await this.aiTest()
        this.createDialogVisible = true
      } catch (error) {
        console.log(error)
      }
    },

    // Close AI content input popup
    closeAiCreateDialog() {
      this.createDialogVisible = false
      this.aiInput = ''
    },

    // Confirm generation
    doAiCreate() {
      const aiInputText = this.aiInput.trim()
      if (!aiInputText) {
        this.$message.warning(this.$t('ai.noInputTip'))
        return
      }
      this.closeAiCreateDialog()
      this.aiCreatingMaskVisible = true
      // Initiate request
      this.isAiCreating = true
      this.aiInstance = new Ai({
        port: this.aiConfig.port
      })
      this.aiInstance.init('huoshan', this.aiConfig)
      this.mindMap.renderer.setRootNodeCenter()
      this.mindMap.setData(null)
      this.aiInstance.request(
        {
          messages: [
            {
              role: 'user',
              content: `${this.$t(
                'ai.aiCreateMsgPrefix'
              )}${aiInputText}${this.$t('ai.aiCreateMsgPostfix')}`
            }
          ]
        },
        content => {
          if (content) {
            const arr = content.split(/\n+/)
            this.aiCreatingContent = arr.splice(0, arr.length - 1).join('\n')
          }
          this.loopRenderOnAiCreating()
        },
        content => {
          this.aiCreatingContent = content
          this.resetOnAiCreatingStop()
        },
        () => {
          this.resetOnAiCreatingStop()
          this.resetOnRenderEnd()
          this.$message.error(this.$t('ai.generationFailed'))
        }
      )
    },

    // Data to reset after AI request completes or encounters an error
    resetOnAiCreatingStop() {
      this.aiCreatingMaskVisible = false
      this.isAiCreating = false
      this.aiInstance = null
    },

    // Data to reset after rendering completes
    resetOnRenderEnd() {
      this.isLoopRendering = false
      this.uidMap = {}
      this.aiCreatingContent = ''
      this.mindMapDataCache = ''
      this.beingAiCreateNodeUid = ''
    },

    // Stop generation
    stopCreate() {
      this.aiInstance.stop()
      this.isAiCreating = false
      this.aiCreatingMaskVisible = false
      this.$message.success(this.$t('ai.stoppedGenerating'))
    },

    // Polling for rendering
    loopRenderOnAiCreating() {
      if (!this.aiCreatingContent.trim() || this.isLoopRendering) return
      this.isLoopRendering = true
      const treeData = transformMarkdownTo(this.aiCreatingContent)
      this.addUid(treeData)
      let lastTreeData = JSON.stringify(treeData)

      // Proceed with next render only after current render completes
      const onRenderEnd = () => {
        // Handle nodes outside canvas
        this.checkNodeOuter()

        // If generation is complete and data is rendered, unbind events
        if (!this.isAiCreating && !this.aiCreatingContent) {
          this.mindMap.off('node_tree_render_end', onRenderEnd)
          this.latestUid = ''
          return
        }

        const treeData = transformMarkdownTo(this.aiCreatingContent)
        this.addUid(treeData)
        // Generation in progress
        if (this.isAiCreating) {
          // Don't trigger re-render if data is the same as last time
          const curTreeData = JSON.stringify(treeData)
          if (curTreeData === lastTreeData) {
            setTimeout(() => {
              onRenderEnd()
            }, 500)
            return
          }
          lastTreeData = curTreeData
          this.mindMap.updateData(treeData)
        } else {
          // Generation completed
          // Trigger one more render to prevent data loss
          this.mindMap.updateData(treeData)
          this.resetOnRenderEnd()
          this.$message.success(this.$t('ai.aiGenerationSuccess'))
        }
      }
      this.mindMap.on('node_tree_render_end', onRenderEnd)

      this.mindMap.setData(treeData)
    },

    // Handle nodes that extend beyond the canvas
    checkNodeOuter() {
      if (this.latestUid) {
        const latestNode = this.mindMap.renderer.findNodeByUid(this.latestUid)
        if (latestNode) {
          const { isOuter, offsetLeft, offsetTop } = checkNodeOuter(
            this.mindMap,
            latestNode,
            100,
            100
          )
          if (isOuter) {
            this.mindMap.view.translateXY(offsetLeft, offsetTop)
          }
        }
      }
    },

    // Add uid to AI-generated data
    addUid(data) {
      const checkRepeatUidMap = {}
      const walk = (node, pUid = '') => {
        if (!node.data) {
          node.data = {}
        }
        if (isUndef(node.data.uid)) {
          // Reuse uid from last generation based on pUid + text content
          const key = pUid + '-' + node.data.text
          node.data.uid = this.uidMap[key] || createUid()
          // If current uid is duplicate, regenerate. Rare case but just in case
          if (checkRepeatUidMap[node.data.uid]) {
            node.data.uid = createUid()
          }
          this.latestUid = this.uidMap[key] = node.data.uid
          checkRepeatUidMap[node.data.uid] = true
        }
        if (node.children && node.children.length > 0) {
          node.children.forEach(child => {
            walk(child, node.data.uid)
          })
        }
      }
      walk(data)
    },

    // Show AI continuation popup
    showAiCreatePartDialog(node) {
      this.beingCreatePartNode = node
      const currentMindMapData = this.mindMap.getData()
      // Fill default content
      this.aiPartInput = `${this.$t(
        'ai.aiCreatePartMsgPrefix'
      )}${getStrWithBrFromHtml(currentMindMapData.data.text)}${this.$t(
        'ai.aiCreatePartMsgCenter'
      )}${getStrWithBrFromHtml(node.getData('text'))}${this.$t(
        'ai.aiCreatePartMsgPostfix'
      )}`
      this.createPartDialogVisible = true
    },

    // Close AI continuation popup
    closeAiCreatePartDialog() {
      this.createPartDialogVisible = false
    },

    // Reset AI continuation popup data
    resetAiCreatePartDialog() {
      this.beingCreatePartNode = null
      this.aiPartInput = ''
    },

    // Confirm AI continuation
    confirmAiCreatePart() {
      if (!this.aiPartInput.trim()) return
      this.closeAiCreatePartDialog()
      this.aiCreatePart()
    },

    // Generate partial AI content
    async aiCreatePart() {
      try {
        if (!this.beingCreatePartNode) {
          return
        }
        await this.aiTest()
        this.beingAiCreateNodeUid = this.beingCreatePartNode.getData('uid')
        const currentMindMapData = this.mindMap.getData()
        this.mindMapDataCache = JSON.stringify(currentMindMapData)
        this.aiCreatingMaskVisible = true
        // Initiate request
        this.isAiCreating = true
        this.aiInstance = new Ai({
          port: this.aiConfig.port
        })
        this.aiInstance.init('huoshan', this.aiConfig)
        this.aiInstance.request(
          {
            messages: [
              {
                role: 'user',
                content:
                  this.aiPartInput.trim() + this.$t('ai.aiCreatePartMsgHelp')
              }
            ]
          },
          content => {
            if (content) {
              const arr = content.split(/\n+/)
              this.aiCreatingContent = arr.splice(0, arr.length - 1).join('\n')
            }

            this.loopRenderOnAiCreatingPart()
          },
          content => {
            this.aiCreatingContent = content
            this.resetOnAiCreatingStop()
            this.resetAiCreatePartDialog()
          },
          () => {
            this.resetOnAiCreatingStop()
            this.resetAiCreatePartDialog()
            this.resetOnRenderEnd()
            this.$message.error(this.$t('ai.generationFailed'))
          }
        )
      } catch (error) {
        console.log(error)
      }
    },

    // Add generated data to specified node
    addToTargetNode(newChildren = []) {
      const initData = JSON.parse(this.mindMapDataCache)
      const walk = node => {
        if (node.data.uid === this.beingAiCreateNodeUid) {
          if (!node.children) {
            node.children = []
          }
          node.children.push(...newChildren)
          return
        }
        if (node.children && node.children.length > 0) {
          node.children.forEach(child => {
            walk(child)
          })
        }
      }
      walk(initData)
      return initData
    },

    // Polling for partial rendering
    loopRenderOnAiCreatingPart() {
      if (!this.aiCreatingContent.trim() || this.isLoopRendering) return
      this.isLoopRendering = true
      const partData = transformMarkdownTo(this.aiCreatingContent)
      this.addUid(partData)
      let lastPartData = JSON.stringify(partData)
      const treeData = this.addToTargetNode(partData.children || [])

      // Proceed with next render only after current render completes
      const onRenderEnd = () => {
        // Handle nodes outside canvas
        this.checkNodeOuter()

        // If generation is complete and data is rendered, unbind events
        if (!this.isAiCreating && !this.aiCreatingContent) {
          this.mindMap.off('node_tree_render_end', onRenderEnd)
          this.latestUid = ''
          return
        }

        const partData = transformMarkdownTo(this.aiCreatingContent)
        this.addUid(partData)
        const treeData = this.addToTargetNode(partData.children || [])

        if (this.isAiCreating) {
          // Don't trigger re-render if data is the same as last time
          const curPartData = JSON.stringify(partData)
          if (curPartData === lastPartData) {
            setTimeout(() => {
              onRenderEnd()
            }, 500)
            return
          }
          lastPartData = curPartData
          this.mindMap.updateData(treeData)
        } else {
          this.mindMap.updateData(treeData)
          this.resetOnRenderEnd()
          this.$message.success(this.$t('ai.aiGenerationSuccess'))
        }
      }
      this.mindMap.on('node_tree_render_end', onRenderEnd)
      // For continuation, use updateData method for first render as well
      this.mindMap.updateData(treeData)
    },

    // AI Chat
    async aiChat(
      messageList = [],
      progress = () => {},
      end = () => {},
      err = () => {}
    ) {
      try {
        await this.aiTest()
        // Initiate request
        this.isAiCreating = true
        this.aiInstance = new Ai({
          port: this.aiConfig.port
        })
        this.aiInstance.init('huoshan', this.aiConfig)
        this.aiInstance.request(
          {
            messages: messageList.map(msg => {
              return {
                role: 'user',
                content: msg
              }
            })
          },
          content => {
            progress(content)
          },
          content => {
            end(content)
          },
          error => {
            err(error)
          }
        )
      } catch (error) {
        console.log(error)
      }
    },

    // Stop AI Chat
    aiChatStop() {
      if (this.aiInstance) {
        this.aiInstance.stop()
        this.isAiCreating = false
        this.aiInstance = null
      }
    }
  }
}
</script>

<style lang="less" scoped>
.clientTipDialog,
.createDialog {
  /deep/ .el-dialog__body {
    padding: 12px 20px;
  }
}

.tipBox {
  p {
    margin-bottom: 12px;

    a {
      color: #409eff;
    }
  }
}

.inputBox {
  .tip {
    margin-top: 12px;

    &.warning {
      color: #f56c6c;
    }
  }
}

.aiCreatingMask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  background-color: transparent;

  .btn {
    position: absolute;
    left: 50%;
    top: 100px;
    transform: translateX(-50%);
  }
}
</style>
