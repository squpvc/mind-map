<template>
  <div
    class="noteContentViewer customScrollbar"
    ref="noteContentViewer"
    :style="{
      left: this.left + 'px',
      top: this.top + 'px',
      visibility: show ? 'visible' : 'hidden'
    }"
    @click.stop
    @mousedown.stop
    @mousemove.stop
    @mouseup.stop
    @wheel.stop
  >
    <div class="noteContentWrap customScrollbar" ref="noteContentWrap"></div>
  </div>
</template>

<script>
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer'
import '@toast-ui/editor/dist/toastui-editor-viewer.css'

// Node note content display
export default {
  props: {
    mindMap: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      editor: null,
      show: false,
      left: 0,
      top: 0,
      node: null
    }
  },
  created() {
    this.$bus.$on('showNoteContent', this.onShowNoteContent)
    this.$bus.$on('hideNoteContent', this.hideNoteContent)
    document.body.addEventListener('click', this.hideNoteContent)
    this.$bus.$on('node_active', this.onNodeActive)
    this.$bus.$on('scale', this.onScale)
    this.$bus.$on('translate', this.onScale)
    this.$bus.$on('svg_mousedown', this.hideNoteContent)
    this.$bus.$on('expand_btn_click', this.hideNoteContent)
  },
  mounted() {
    this.mindMap.el.appendChild(this.$refs.noteContentViewer)
    this.initEditor()
  },
  beforeDestroy() {
    this.$bus.$off('showNoteContent', this.onShowNoteContent)
    this.$bus.$off('hideNoteContent', this.hideNoteContent)
    document.body.removeEventListener('click', this.hideNoteContent)
    this.$bus.$off('node_active', this.onNodeActive)
    this.$bus.$off('scale', this.onScale)
    this.$bus.$off('translate', this.onScale)
    this.$bus.$off('svg_mousedown', this.hideNoteContent)
    this.$bus.$off('expand_btn_click', this.hideNoteContent)
  },
  methods: {
    onNodeActive(...args) {
      const nodes = [...args[1]]
      if (nodes.length > 0) {
        if (nodes[0] !== this.node) {
          this.hideNoteContent()
        }
      } else {
        this.hideNoteContent()
      }
    },

    // Show note popup
    onShowNoteContent(content, left, top, node) {
      this.node = node
      this.editor.setMarkdown(content)
      this.handleALink()
      this.updateNoteContentPosition(left, top)
      this.show = true
    },

    // Open hyperlink in new window
    handleALink() {
      const list = this.$refs.noteContentViewer.querySelectorAll('a')
      Array.from(list).forEach(a => {
        a.setAttribute('target', '_blank')
      })
    },

    // Update position
    updateNoteContentPosition(left, top) {
      const { width, height } = this.$refs.noteContentViewer.getBoundingClientRect()
      const { right, bottom } = this.mindMap.elRect
      this.left = left + width > right ? right - width : left
      this.top = top + height > bottom ? bottom - height : top
    },

    // Canvas zoom event
    onScale() {
      if (!this.node || !this.show) return
      const { left, top } = this.node.getNoteContentPosition()
      this.updateNoteContentPosition(left, top)
    },

    // Hide note popup
    hideNoteContent() {
      this.show = false
    },

    // Initialize editor
    initEditor() {
      if (!this.editor) {
        this.editor = new Viewer({
          el: this.$refs.noteContentWrap
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.noteContentViewer {
  position: fixed;
  background-color: #fff;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.06);
  z-index: 2;

  .noteContentWrap {
    max-width: 250px;
    max-height: 300px;
    overflow-y: auto;
  }
}
</style>
