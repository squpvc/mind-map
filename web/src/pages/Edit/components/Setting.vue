<template>
  <Sidebar ref="sidebar" :title="$t('setting.title')">
    <div
      class="sidebarContent customScrollbar"
      :class="{ isDark: isDark }"
      v-if="configData"
    >
      <!-- Watermark -->
      <div class="row">
        <!-- Whether to show watermark -->
        <div class="rowItem">
          <el-checkbox
            v-model="watermarkConfig.show"
            @change="watermarkShowChange"
            >{{ $t('setting.showWatermark') }}</el-checkbox
          >
        </div>
      </div>
      <template v-if="watermarkConfig.show">
        <!-- Only show when exporting -->
        <div class="row">
          <div class="rowItem">
            <el-checkbox
              v-model="watermarkConfig.onlyExport"
              @change="updateWatermarkConfig"
              >{{ $t('setting.onlyExport') }}</el-checkbox
            >
          </div>
        </div>
        <!-- Below node -->
        <div class="row">
          <div class="rowItem">
            <el-checkbox
              v-model="watermarkConfig.belowNode"
              @change="updateWatermarkConfig"
              >{{ $t('setting.belowNode') }}</el-checkbox
            >
          </div>
        </div>
        <!-- Watermark text -->
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t('setting.watermarkText') }}</span>
            <el-input
              v-model="watermarkConfig.text"
              size="small"
              @change="updateWatermarkConfig"
              @keydown.native.stop
            ></el-input>
          </div>
        </div>
        <!-- Watermark text color -->
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t('setting.watermarkTextColor') }}</span>
            <span
              class="block"
              v-popover:popover3
              :style="{ backgroundColor: watermarkConfig.textStyle.color }"
            ></span>
            <el-popover ref="popover3" placement="bottom" trigger="click">
              <Color
                :color="watermarkConfig.textStyle.color"
                @change="
                  value => {
                    watermarkConfig.textStyle.color = value
                    updateWatermarkConfig()
                  }
                "
              ></Color>
            </el-popover>
          </div>
        </div>
        <!-- Watermark text opacity -->
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t('setting.watermarkTextOpacity') }}</span>
            <el-slider
              v-model="watermarkConfig.textStyle.opacity"
              style="width: 170px"
              :min="0"
              :max="1"
              :step="0.1"
              @change="updateWatermarkConfig"
            ></el-slider>
          </div>
        </div>
        <!-- Watermark text font size -->
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t('setting.watermarkTextFontSize') }}</span>
            <el-input-number
              v-model="watermarkConfig.textStyle.fontSize"
              size="small"
              :min="0"
              :max="50"
              :step="1"
              @change="updateWatermarkConfig"
              @keydown.native.stop
            ></el-input-number>
          </div>
        </div>
        <!-- Rotation angle -->
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t('setting.watermarkAngle') }}</span>
            <el-input-number
              v-model="watermarkConfig.angle"
              size="small"
              :min="0"
              :max="90"
              :step="10"
              @change="updateWatermarkConfig"
              @keydown.native.stop
            ></el-input-number>
          </div>
        </div>
        <!-- Watermark line spacing -->
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t('setting.watermarkLineSpacing') }}</span>
            <el-input-number
              v-model="watermarkConfig.lineSpacing"
              size="small"
              :step="10"
              @change="updateWatermarkConfig"
              @keydown.native.stop
            ></el-input-number>
          </div>
        </div>
        <!-- Watermark text spacing -->
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t('setting.watermarkTextSpacing') }}</span>
            <el-input-number
              v-model="watermarkConfig.textSpacing"
              size="small"
              :step="10"
              @change="updateWatermarkConfig"
              @keydown.native.stop
            ></el-input-number>
          </div>
        </div>
      </template>
      <!-- Configure performance mode -->
      <div class="row">
        <div class="rowItem">
          <el-checkbox
            v-model="config.openPerformance"
            @change="
              value => {
                updateOtherConfig('openPerformance', value)
              }
            "
            >{{ $t('setting.openPerformance') }}</el-checkbox
          >
        </div>
      </div>
      <!-- Enable free drag -->
      <div class="row">
        <div class="rowItem">
          <el-checkbox
            v-model="config.enableFreeDrag"
            @change="
              value => {
                updateOtherConfig('enableFreeDrag', value)
              }
            "
            >{{ $t('setting.enableFreeDrag') }}</el-checkbox
          >
        </div>
      </div>
      <!-- Enable rich text editing -->
      <div class="row">
        <div class="rowItem">
          <el-checkbox
            v-model="enableNodeRichText"
            @change="enableNodeRichTextChange"
            >{{ $t('setting.isEnableNodeRichText') }}</el-checkbox
          >
        </div>
      </div>
      <!-- Update node size in real-time during text editing -->
      <div class="row">
        <div class="rowItem">
          <el-checkbox
            v-model="config.openRealtimeRenderOnNodeTextEdit"
            @change="
              updateOtherConfig('openRealtimeRenderOnNodeTextEdit', $event)
            "
            >{{ $t('setting.openRealtimeRenderOnNodeTextEdit') }}</el-checkbox
          >
        </div>
      </div>
      <!-- Show scrollbar -->
      <div class="row">
        <div class="rowItem">
          <el-checkbox
            v-model="localConfigs.isShowScrollbar"
            @change="updateLocalConfig('isShowScrollbar', $event)"
            >{{ $t('setting.isShowScrollbar') }}</el-checkbox
          >
        </div>
      </div>
      <!-- Always show expand/collapse buttons -->
      <div class="row">
        <div class="rowItem">
          <el-checkbox
            v-model="config.alwaysShowExpandBtn"
            @change="updateOtherConfig('alwaysShowExpandBtn', $event)"
            >{{ $t('setting.alwaysShowExpandBtn') }}</el-checkbox
          >
        </div>
      </div>
      <!-- Auto-enter text edit mode on keyboard input -->
      <div class="row">
        <div class="rowItem">
          <el-checkbox
            v-model="config.enableAutoEnterTextEditWhenKeydown"
            @change="
              updateOtherConfig('enableAutoEnterTextEditWhenKeydown', $event)
            "
            >{{ $t('setting.enableAutoEnterTextEditWhenKeydown') }}</el-checkbox
          >
        </div>
      </div>
      <!-- Enable file import via drag and drop -->
      <div class="row">
        <div class="rowItem">
          <el-checkbox
            v-model="localConfigs.enableDragImport"
            @change="updateLocalConfig('enableDragImport', $event)"
            >{{ $t('setting.enableDragImport') }}</el-checkbox
          >
        </div>
      </div>
      <!-- Allow node connection style to inherit from ancestors -->
      <div class="row">
        <div class="rowItem">
          <el-checkbox
            v-model="config.enableInheritAncestorLineStyle"
            @change="
              updateOtherConfig('enableInheritAncestorLineStyle', $event)
            "
            >{{ $t('setting.enableInheritAncestorLineStyle') }}</el-checkbox
          >
        </div>
      </div>
      <!-- Enable AI features -->
      <div class="row">
        <div class="rowItem">
          <el-checkbox
            v-model="localConfigs.enableAi"
            @change="updateLocalConfig('enableAi', $event)"
            >{{ $t('setting.enableAi') }}</el-checkbox
          >
        </div>
      </div>
      <!-- Configure mouse wheel behavior -->
      <div class="row">
        <div class="rowItem">
          <span class="name">{{ $t('setting.mousewheelAction') }}</span>
          <el-select
            size="mini"
            style="width: 120px"
            v-model="config.mousewheelAction"
            placeholder=""
            @change="
              value => {
                updateOtherConfig('mousewheelAction', value)
              }
            "
          >
            <el-option :label="$t('setting.zoomView')" value="zoom"></el-option>
            <el-option
              :label="$t('setting.moveViewUpDown')"
              value="move"
            ></el-option>
          </el-select>
        </div>
      </div>
      <!-- Configure mouse zoom behavior -->
      <div class="row" v-if="config.mousewheelAction === 'zoom'">
        <div class="rowItem">
          <span class="name">{{
            $t('setting.mousewheelZoomActionReverse')
          }}</span>
          <el-select
            size="mini"
            style="width: 120px"
            v-model="config.mousewheelZoomActionReverse"
            placeholder=""
            @change="
              value => {
                updateOtherConfig('mousewheelZoomActionReverse', value)
              }
            "
          >
            <el-option
              :label="$t('setting.mousewheelZoomActionReverse1')"
              :value="false"
            ></el-option>
            <el-option
              :label="$t('setting.mousewheelZoomActionReverse2')"
              :value="true"
            ></el-option>
          </el-select>
        </div>
      </div>
      <!-- Behavior when creating new nodes -->
      <div class="row">
        <div class="rowItem">
          <span class="name">{{ $t('setting.createNewNodeBehavior') }}</span>
          <el-select
            size="mini"
            style="width: 120px"
            v-model="config.createNewNodeBehavior"
            placeholder=""
            @change="
              value => {
                updateOtherConfig('createNewNodeBehavior', value)
              }
            "
          >
            <el-option
              :label="$t('setting.default')"
              value="default"
            ></el-option>
            <el-option
              :label="$t('setting.notActive')"
              value="notActive"
            ></el-option>
            <el-option
              :label="$t('setting.activeOnly')"
              value="activeOnly"
            ></el-option>
          </el-select>
        </div>
      </div>
      <!-- Spacing between images and text -->
      <div class="row">
        <div class="rowItem">
          <span class="name">{{ $t('setting.imgTextMargin') }}</span>
          <el-slider
            style="width: 150px"
            v-model="config.imgTextMargin"
            @change="
              value => {
                updateOtherConfig('imgTextMargin', value)
              }
            "
          ></el-slider>
        </div>
      </div>
      <!-- Spacing between text elements -->
      <div class="row">
        <div class="rowItem">
          <span class="name">{{ $t('setting.textContentMargin') }}</span>
          <el-slider
            style="width: 150px"
            v-model="config.textContentMargin"
            @change="
              value => {
                updateOtherConfig('textContentMargin', value)
              }
            "
          ></el-slider>
        </div>
      </div>
    </div>
  </Sidebar>
</template>

<script>
import Sidebar from './Sidebar.vue'
import { storeConfig } from '@/api'
import { mapState, mapMutations } from 'vuex'
import Color from './Color.vue'

export default {
  components: {
    Sidebar,
    Color
  },
  props: {
    configData: {
      type: Object,
      default: null
    },
    mindMap: {
      type: Object
    }
  },
  data() {
    return {
      config: {
        openPerformance: false,
        enableFreeDrag: false,
        mousewheelAction: 'zoom',
        mousewheelZoomActionReverse: false,
        createNewNodeBehavior: 'default',
        openRealtimeRenderOnNodeTextEdit: true,
        alwaysShowExpandBtn: false,
        enableAutoEnterTextEditWhenKeydown: true,
        imgTextMargin: 0,
        textContentMargin: 0,
        enableInheritAncestorLineStyle: false
      },
      watermarkConfig: {
        show: false,
        onlyExport: false,
        text: '',
        lineSpacing: 100,
        textSpacing: 100,
        angle: 30,
        textStyle: {
          color: '',
          opacity: 0,
          fontSize: 1
        }
      },
      updateWatermarkTimer: null,
      enableNodeRichText: true,
      localConfigs: {
        isShowScrollbar: false,
        enableDragImport: false,
        enableAi: false
      }
    }
  },
  computed: {
    ...mapState({
      activeSidebar: state => state.activeSidebar,
      localConfig: state => state.localConfig,
      isDark: state => state.localConfig.isDark
    })
  },
  watch: {
    activeSidebar(val) {
      if (val === 'setting') {
        this.$refs.sidebar.show = true
        this.initConfig()
        this.initWatermark()
      } else {
        this.$refs.sidebar.show = false
      }
    }
  },
  created() {
    this.initLoacalConfig()
    this.$bus.$on('toggleOpenNodeRichText', this.onToggleOpenNodeRichText)
  },
  beforeDestroy() {
    this.$bus.$off('toggleOpenNodeRichText', this.onToggleOpenNodeRichText)
  },
  methods: {
    ...mapMutations(['setLocalConfig']),

    // Initialize other configurations
    initConfig() {
      Object.keys(this.config).forEach(key => {
        if (typeof this.config[key] === 'object') {
          this.config[key] = {
            ...(this.mindMap.getConfig(key) || {})
          }
        } else {
          this.config[key] = this.mindMap.getConfig(key)
        }
      })
    },

    // Initialize local configuration
    initLoacalConfig() {
      this.enableNodeRichText = this.localConfig.openNodeRichText
      this.mousewheelAction = this.localConfig.mousewheelAction
      this.mousewheelZoomActionReverse = this.localConfig.mousewheelZoomActionReverse
      Object.keys(this.localConfigs).forEach(key => {
        this.localConfigs[key] = this.localConfig[key]
      })
    },

    // Initialize watermark configuration
    initWatermark() {
      const config = this.mindMap.getConfig('watermarkConfig')
      ;['text', 'lineSpacing', 'textSpacing', 'angle', 'onlyExport'].forEach(
        key => {
          this.watermarkConfig[key] = config[key]
        }
      )
      this.watermarkConfig.show = !!config.text
      this.watermarkConfig.textStyle = { ...config.textStyle }
    },

    // Update other configurations
    updateOtherConfig(key, value) {
      this.mindMap.updateConfig({
        [key]: value
      })
      this.configData[key] = value
      storeConfig(this.configData)
      if (
        [
          'alwaysShowExpandBtn',
          'imgTextMargin',
          'textContentMargin',
          'enableInheritAncestorLineStyle'
        ].includes(key)
      ) {
        this.mindMap.reRender()
      }
    },

    // Update watermark configuration
    updateWatermarkConfig() {
      clearTimeout(this.updateWatermarkTimer)
      this.updateWatermarkTimer = setTimeout(() => {
        let { show, ...config } = this.watermarkConfig
        this.mindMap.watermark.updateWatermark({
          ...config
        })
        this.configData.watermarkConfig = this.mindMap.getConfig(
          'watermarkConfig'
        )
        storeConfig(this.configData)
      }, 300)
    },

    // Toggle watermark visibility
    watermarkShowChange(value) {
      if (value) {
        let text =
          this.watermarkConfig.text || this.$t('setting.watermarkDefaultText')
        this.watermarkConfig.text = text
      } else {
        this.watermarkConfig.text = ''
      }
      this.updateWatermarkConfig()
    },

    // Toggle rich text editing for nodes
    enableNodeRichTextChange(e) {
      this.$confirm(
        this.$t('setting.changeRichTextTip'),
        e
          ? this.$t('setting.changeRichTextTip2')
          : this.$t('setting.changeRichTextTip3'),
        {
          confirmButtonText: this.$t('setting.confirm'),
          cancelButtonText: this.$t('setting.cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          this.mindMap.renderer.textEdit.hideEditTextBox()
          this.setLocalConfig({
            openNodeRichText: e
          })
        })
        .catch(() => {
          this.enableNodeRichText = !this.enableNodeRichText
        })
    },

    onToggleOpenNodeRichText(val) {
      this.setLocalConfig({
        openNodeRichText: val
      })
      this.enableNodeRichText = val
    },

    // Local configuration
    updateLocalConfig(key, value) {
      this.setLocalConfig({
        [key]: value
      })
    }
  }
}
</script>

<style lang="less" scoped>
.sidebarContent {
  padding: 20px;
  padding-top: 10px;

  &.isDark {
    .title {
      color: #fff;
    }

    .row {
      .rowItem {
        .name {
          color: hsla(0, 0%, 100%, 0.6);
        }
      }
    }
  }

  .title {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(26, 26, 26, 0.9);
    margin-bottom: 10px;
    margin-top: 20px;

    &.noTop {
      margin-top: 0;
    }
  }

  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    .rowItem {
      display: flex;
      align-items: center;
      margin-bottom: 5px;

      .name {
        font-size: 12px;
        margin-right: 10px;
        white-space: nowrap;
      }

      .block {
        display: inline-block;
        width: 30px;
        height: 30px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }
}
</style>
