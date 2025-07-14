<template>
  <div
    class="outlineEditContainer"
    :class="{ isDark: isDark }"
    ref="outlineEditContainer"
    v-if="isOutlineEdit"
  >
    <div class="btnList">
      <el-tooltip
        class="item"
        effect="dark"
        :content="$t('outline.print')"
        placement="top"
      >
        <div class="btn" @click="onPrint">
          <span class="icon iconfont iconprinting"></span>
        </div>
      </el-tooltip>
      <div class="btn" @click="onClose">
        <span class="icon iconfont iconguanbi"></span>
      </div>
    </div>
    <div
      class="outlineEditBox"
      id="fullScreenOutlineEditBox"
      ref="outlineEditBox"
    >
      <div class="outlineEdit">
        <el-tree
          ref="tree"
          class="outlineTree"
          node-key="uid"
          draggable
          default-expand-all
          :class="{ isDark: isDark }"
          :data="data"
          :props="defaultProps"
          :highlight-current="true"
          :expand-on-click-node="false"
          :allow-drag="checkAllowDrag"
          @node-drop="onNodeDrop"
          @current-change="onCurrentChange"
        >
          <span
            class="customNode"
            slot-scope="{ node, data }"
            :data-id="data.uid"
          >
            <span
              class="nodeEdit"
              :contenteditable="!isReadonly"
              :key="getKey()"
              @blur="onBlur($event, node)"
              @keydown.stop="onNodeInputKeydown($event, node)"
              @keyup.stop
              @paste="onPaste($event, node)"
              v-html="node.label"
            ></span>
          </span>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import {
  nodeRichTextToTextWithWrap,
  textToNodeRichTextWithWrap,
  createUid,
  simpleDeepClone,
  htmlEscape,
  handleInputPasteText
} from 'simple-mind-map/src/utils'
import { storeData } from '@/api'
import { printOutline } from '@/utils'

// Outline sidebar
export default {
  props: {
    mindMap: {
      type: Object
    }
  },
  data() {
    return {
      data: [],
      defaultProps: {
        label: 'label'
      },
      currentData: null
    }
  },
  computed: {
    ...mapState({
      isReadonly: state => state.isReadonly,
      isDark: state => state.localConfig.isDark,
      isOutlineEdit: state => state.isOutlineEdit
    })
  },
  watch: {
    isOutlineEdit(val) {
      if (val) {
        this.refresh()
        this.$nextTick(() => {
          document.body.appendChild(this.$refs.outlineEditContainer)
        })
      }
    }
  },
  created() {
    window.addEventListener('keydown', this.onKeyDown)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeyDown)
  },
  methods: {
    ...mapMutations(['setIsOutlineEdit']),

    // Refresh tree data
    refresh() {
      let data = this.mindMap.getData()
      data.root = true // Mark root node
      let walk = root => {
        let text = root.data.richText
          ? nodeRichTextToTextWithWrap(root.data.text)
          : root.data.text
        text = htmlEscape(text)
        text = text.replace(/\n/g, '<br>')
        root.textCache = text // Save a copy of the data before modification to compare if it has been changed
        root.label = text
        root.uid = root.data.uid
        if (root.children && root.children.length > 0) {
          root.children.forEach(item => {
            walk(item)
          })
        }
      }
      walk(data)
      this.data = [data]
    },

    // Root node cannot be dragged
    checkAllowDrag(node) {
      return !node.data.root
    },

    // Drag end event
    onNodeDrop() {
      this.save()
    },

    // Currently selected tree node change event
    onCurrentChange(data) {
      this.currentData = data
    },

    // Update node text when losing focus
    onBlur(e, node) {
      // Node data has not been modified
      if (node.data.textCache === e.target.innerHTML) {
        return
      }
      const richText = node.data.data.richText
      const text = richText ? e.target.innerHTML : e.target.innerText
      node.data.data.text = richText ? textToNodeRichTextWithWrap(text) : text
      node.data.textCache = e.target.innerHTML
      this.save()
    },

    // Node input area key event
    onNodeInputKeydown(e, node) {
      const richText = !!node.data.data.richText
      const uid = createUid()
      const text = this.$t('outline.nodeDefaultText')
      const data = {
        textCache: text,
        uid,
        label: text,
        data: {
          text: richText ? textToNodeRichTextWithWrap(text) : text,
          uid,
          richText
        },
        children: []
      }
      if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault()
        if (node.data.root) {
          return
        }
        this.$refs.tree.insertAfter(data, node)
      }
      if (e.keyCode === 9) {
        e.preventDefault()
        if (e.shiftKey) {
          // Move up one level
          this.$refs.tree.insertAfter(node.data, node.parent)
          this.$refs.tree.remove(node)
        } else {
          this.$refs.tree.append(data, node)
        }
      }
      this.save()
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(uid)
        const el = document.querySelector(
          `.customNode[data-id="${uid}"] .nodeEdit`
        )
        if (el) {
          let selection = window.getSelection()
          let range = document.createRange()
          range.selectNodeContents(el)
          selection.removeAllRanges()
          selection.addRange(range)
          let offsetTop = el.offsetTop
          this.scrollTo(offsetTop)
        }
      })
    },

    // Delete node
    onKeyDown(e) {
      if (!this.isOutlineEdit) return
      if ([46, 8].includes(e.keyCode) && this.currentData) {
        e.stopPropagation()
        this.$refs.tree.remove(this.currentData)
        this.currentData = null
        this.save()
      }
    },

    // Intercept paste event
    onPaste(e) {
      handleInputPasteText(e)
    },

    // Generate unique key
    getKey() {
      return Math.random()
    },

    // Print
    onPrint() {
      printOutline(this.$refs.outlineEditBox)
    },

    // Close
    onClose() {
      this.setIsOutlineEdit(false)
      this.$bus.$emit('setData', this.getData())
    },

    // Scroll
    scrollTo(y) {
      let container = this.$refs.outlineEditBox
      let height = container.offsetHeight
      let top = container.scrollTop
      y += 50
      if (y > top + height) {
        container.scrollTo(0, y - height / 2)
      }
    },

    // Get mind map data
    getData() {
      let newNode = {}
      let node = this.data[0]
      let walk = (root, newRoot) => {
        newRoot.data = root.data
        newRoot.children = []
        ;(root.children || []).forEach(child => {
          const newChild = {}
          newRoot.children.push(newChild)
          walk(child, newChild)
        })
      }
      walk(node, newNode)
      return simpleDeepClone(newNode)
    },

    // Save
    save() {
      storeData({
        root: this.getData()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.outlineEditContainer {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1999;
  background-color: #fff;
  overflow: hidden;

  &.isDark {
    background-color: #262a2e;

    .btnList {
      .btn {
        .icon {
          color: #fff;
        }
      }
    }
  }

  .btnList {
    position: absolute;
    right: 40px;
    top: 20px;
    display: flex;
    align-items: center;

    .btn {
      cursor: pointer;
      margin-left: 12px;

      .icon {
        font-size: 28px;
      }
    }
  }

  .outlineEditBox {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 50px 0;

    .outlineEdit {
      width: 1000px;
      height: 100%;
      height: max-content;
      margin: 0 auto;

      /deep/ .customNode {
        .nodeEdit {
          max-width: 800px;
        }
      }
    }
  }
}

.customNode {
  width: 100%;
  color: rgba(0, 0, 0, 0.85);
  font-weight: bold;

  .nodeEdit {
    outline: none;
    white-space: normal;
    padding-right: 20px;
  }
}
</style>
<style lang="less" scoped>
@import url('../../../style/outlineTree.less');
</style>
