<template>
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
    @node-drag-start="onNodeDragStart"
    @node-drag-end="onNodeDragEnd"
    @current-change="onCurrentChange"
    @mouseenter.native="isInTreArea = true"
    @mouseleave.native="isInTreArea = false"
  >
    <span
      class="customNode"
      slot-scope="{ node, data }"
      :data-id="data.uid"
      @click="onClick(data)"
    >
      <span
        class="nodeEdit"
        :contenteditable="!isReadonly"
        :key="getKey()"
        @keydown.stop="onNodeInputKeydown($event, node)"
        @keyup.stop
        @blur="onBlur($event, node)"
        @paste="onPaste($event, node)"
        v-html="node.label"
      ></span>
    </span>
  </el-tree>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import {
  nodeRichTextToTextWithWrap,
  textToNodeRichTextWithWrap,
  createUid,
  htmlEscape,
  handleInputPasteText
} from 'simple-mind-map/src/utils'

// Outline tree
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
      currentData: null,
      notHandleDataChange: false,
      isHandleNodeTreeRenderEnd: false,
      beInsertNodeUid: '',
      insertType: '',
      isInTreArea: false,
      isAfterCreateNewNode: false
    }
  },
  computed: {
    ...mapState({
      isReadonly: state => state.isReadonly,
      isDark: state => state.localConfig.isDark
    })
  },
  created() {
    window.addEventListener('keydown', this.onKeyDown)
    this.$bus.$on('data_change', this.handleDataChange)
    this.$bus.$on('node_tree_render_end', this.handleNodeTreeRenderEnd)
    this.$bus.$on('hide_text_edit', this.handleHideTextEdit)
  },
  mounted() {
    this.refresh()
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeyDown)
    this.$bus.$off('data_change', this.handleDataChange)
    this.$bus.$off('node_tree_render_end', this.handleNodeTreeRenderEnd)
    this.$bus.$off('hide_text_edit', this.handleHideTextEdit)
  },
  methods: {
    ...mapMutations(['setIsDragOutlineTreeNode']),

    handleHideTextEdit() {
      if (this.notHandleDataChange) {
        this.notHandleDataChange = false
        this.refresh()
      }
    },

    handleDataChange() {
      // Do not respond to this event when operating nodes in the outline, otherwise the tree will be refreshed
      if (this.notHandleDataChange) {
        this.notHandleDataChange = false
        this.isAfterCreateNewNode = false
        return
      }
      if (this.isAfterCreateNewNode) {
        this.isAfterCreateNewNode = false
        return
      }
      this.refresh()
    },

    handleNodeTreeRenderEnd() {
      // There is currently an unfinished node insertion operation
      if (this.insertType) {
        this[this.insertType]()
        this.insertType = ''
        return
      }
      // Need to perform some operations after inserting a new node
      if (this.isHandleNodeTreeRenderEnd) {
        this.isHandleNodeTreeRenderEnd = false
        this.refresh()
        this.$nextTick(() => {
          this.afterCreateNewNode()
        })
      }
    },

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

    // After inserting a new node
    afterCreateNewNode() {
      // If it is a newly inserted node, then we need to manually highlight the node, position it, and focus it
      let id = this.beInsertNodeUid
      if (id && this.$refs.tree) {
        try {
          this.isAfterCreateNewNode = true
          // Highlight tree node
          this.$refs.tree.setCurrentKey(id)
          let node = this.$refs.tree.getNode(id)
          this.onCurrentChange(node.data)
          // Position the node
          this.onClick(node.data)
          // Focus the edit box of the tree node
          const el = document.querySelector(
            `.customNode[data-id="${id}"] .nodeEdit`
          )
          if (el) {
            let selection = window.getSelection()
            let range = document.createRange()
            range.selectNodeContents(el)
            selection.removeAllRanges()
            selection.addRange(range)
            let offsetTop = el.offsetTop
            this.$emit('scrollTo', offsetTop)
          }
        } catch (error) {
          console.log(error)
        }
      }
      this.beInsertNodeUid = ''
    },

    // Root node is not allowed to be dragged
    checkAllowDrag(node) {
      return !node.data.root
    },

    // Update node text when losing focus
    onBlur(e, node) {
      // Node data has not been modified
      if (node.data.textCache === e.target.innerHTML) {
        // If there is an unexecuted new node insertion operation, execute it directly
        if (this.insertType) {
          this[this.insertType]()
          this.insertType = ''
        }
        return
      }
      // Otherwise, the new node insertion operation needs to wait for the current modification event to complete rendering
      const richText = node.data.data.richText
      const text = richText ? e.target.innerHTML : e.target.innerText
      const targetNode = this.mindMap.renderer.findNodeByUid(node.data.uid)
      if (!targetNode) return
      this.notHandleDataChange = true
      if (richText) {
        targetNode.setText(textToNodeRichTextWithWrap(text), true)
      } else {
        targetNode.setText(text)
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

    // Node input area key event
    onNodeInputKeydown(e) {
      if (e.keyCode === 13 && !e.shiftKey) {
        // Insert sibling node
        e.preventDefault()
        this.insertType = 'insertNode'
        e.target.blur()
      }
      if (e.keyCode === 9) {
        e.preventDefault()
        if (e.shiftKey) {
          // Move node up one level
          this.insertType = 'moveUp'
          e.target.blur()
        } else {
          // Insert child node
          this.insertType = 'insertChildNode'
          e.target.blur()
        }
      }
    },

    // Move node up one level
    moveUp() {
      this.mindMap.execCommand('MOVE_UP_ONE_LEVEL')
    },

    // Insert sibling node
    insertNode() {
      this.notHandleDataChange = true
      this.isHandleNodeTreeRenderEnd = true
      this.beInsertNodeUid = createUid()
      this.mindMap.execCommand('INSERT_NODE', false, [], {
        uid: this.beInsertNodeUid
      })
    },

    // Insert child node
    insertChildNode() {
      this.notHandleDataChange = true
      this.isHandleNodeTreeRenderEnd = true
      this.beInsertNodeUid = createUid()
      this.mindMap.execCommand('INSERT_CHILD_NODE', false, [], {
        uid: this.beInsertNodeUid
      })
    },

    // Activate current node and move it to the center of the canvas
    onClick(data) {
      this.notHandleDataChange = true
      const targetNode = this.mindMap.renderer.findNodeByUid(data.uid)
      if (targetNode && targetNode.nodeData.data.isActive) return
      this.mindMap.execCommand('GO_TARGET_NODE', data.uid, () => {
        this.notHandleDataChange = false
      })
    },

    onNodeDragStart() {
      this.setIsDragOutlineTreeNode(true)
    },

    onNodeDragEnd() {
      this.setIsDragOutlineTreeNode(false)
    },

    // Drag end event
    onNodeDrop(data, target, postion) {
      this.notHandleDataChange = true
      const node = this.mindMap.renderer.findNodeByUid(data.data.uid)
      const targetNode = this.mindMap.renderer.findNodeByUid(target.data.uid)
      if (!node || !targetNode) {
        return
      }
      switch (postion) {
        case 'before':
          this.mindMap.execCommand('INSERT_BEFORE', node, targetNode)
          break
        case 'after':
          this.mindMap.execCommand('INSERT_AFTER', node, targetNode)
          break
        case 'inner':
          this.mindMap.execCommand('MOVE_NODE_TO', node, targetNode)
          break
        default:
          break
      }
    },

    // Currently selected tree node change event
    onCurrentChange(data) {
      this.currentData = data
    },

    // Delete node
    onKeyDown(e) {
      if (!this.isInTreArea) return
      if ([46, 8].includes(e.keyCode) && this.currentData) {
        e.stopPropagation()
        this.mindMap.renderer.textEdit.hideEditTextBox()
        const node = this.mindMap.renderer.findNodeByUid(this.currentData.uid)
        if (node && !node.isRoot) {
          this.notHandleDataChange = true
          this.$refs.tree.remove(this.currentData)
          this.mindMap.execCommand('REMOVE_NODE', [node])
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
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
