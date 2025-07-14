<template>
  <div class="toolbarNodeBtnList" :class="[dir, { isDark: isDark }]">
    <template v-for="item in list">
      <div
        v-if="item === 'back'"
        class="toolbarBtn"
        :class="{
          disabled: readonly || backEnd
        }"
        @click="$bus.$emit('execCommand', 'BACK')"
      >
        <span class="icon iconfont iconhoutui-shi"></span>
        <span class="text">{{ $t('toolbar.undo') }}</span>
      </div>
      <div
        v-if="item === 'forward'"
        class="toolbarBtn"
        :class="{
          disabled: readonly || forwardEnd
        }"
        @click="$bus.$emit('execCommand', 'FORWARD')"
      >
        <span class="icon iconfont iconqianjin1"></span>
        <span class="text">{{ $t('toolbar.redo') }}</span>
      </div>
      <div
        v-if="item === 'painter'"
        class="toolbarBtn"
        :class="{
          disabled: activeNodes.length <= 0 || hasGeneralization,
          active: isInPainter
        }"
        @click="$bus.$emit('startPainter')"
      >
        <span class="icon iconfont iconjiedian"></span>
        <span class="text">{{ $t('toolbar.painter') }}</span>
      </div>
      <div
        v-if="item === 'siblingNode'"
        class="toolbarBtn"
        :class="{
          disabled: activeNodes.length <= 0 || hasRoot || hasGeneralization
        }"
        @click="$bus.$emit('execCommand', 'INSERT_NODE')"
      >
        <span class="icon iconfont iconjiedian"></span>
        <span class="text">{{ $t('toolbar.insertSiblingNode') }}</span>
      </div>
      <div
        v-if="item === 'childNode'"
        class="toolbarBtn"
        :class="{
          disabled: activeNodes.length <= 0 || hasGeneralization
        }"
        @click="$bus.$emit('execCommand', 'INSERT_CHILD_NODE')"
      >
        <span class="icon iconfont icontianjiazijiedian"></span>
        <span class="text">{{ $t('toolbar.insertChildNode') }}</span>
      </div>
      <div
        v-if="item === 'deleteNode'"
        class="toolbarBtn"
        :class="{
          disabled: activeNodes.length <= 0
        }"
        @click="$bus.$emit('execCommand', 'REMOVE_NODE')"
      >
        <span class="icon iconfont iconshanchu"></span>
        <span class="text">{{ $t('toolbar.deleteNode') }}</span>
      </div>
      <div
        v-if="item === 'image'"
        class="toolbarBtn"
        :class="{
          disabled: activeNodes.length <= 0
        }"
        @click="$bus.$emit('showNodeImage')"
      >
        <span class="icon iconfont iconimage"></span>
        <span class="text">{{ $t('toolbar.image') }}</span>
      </div>
      <div
        v-if="item === 'icon'"
        class="toolbarBtn"
        :class="{
          disabled: activeNodes.length <= 0
        }"
        @click="showNodeIcon"
      >
        <span class="icon iconfont iconxiaolian"></span>
        <span class="text">{{ $t('toolbar.icon') }}</span>
      </div>
      <div
        v-if="item === 'link'"
        class="toolbarBtn"
        :class="{
          disabled: activeNodes.length <= 0
        }"
        @click="$bus.$emit('showNodeLink')"
      >
        <span class="icon iconfont iconchaolianjie"></span>
        <span class="text">{{ $t('toolbar.link') }}</span>
      </div>
      <div
        v-if="item === 'note'"
        class="toolbarBtn"
        :class="{
          disabled: activeNodes.length <= 0
        }"
        @click="$bus.$emit('showNodeNote')"
      >
        <span class="icon iconfont iconflow-Mark"></span>
        <span class="text">{{ $t('toolbar.note') }}</span>
      </div>
      <div
        v-if="item === 'tag'"
        class="toolbarBtn"
        :class="{
          disabled: activeNodes.length <= 0
        }"
        @click="$bus.$emit('showNodeTag')"
      >
        <span class="icon iconfont iconbiaoqian"></span>
        <span class="text">{{ $t('toolbar.tag') }}</span>
      </div>
      <div
        v-if="item === 'summary'"
        class="toolbarBtn"
        :class="{
          disabled: activeNodes.length <= 0 || hasRoot || hasGeneralization
        }"
        @click="$bus.$emit('execCommand', 'ADD_GENERALIZATION')"
      >
        <span class="icon iconfont icongaikuozonglan"></span>
        <span class="text">{{ $t('toolbar.summary') }}</span>
      </div>
      <div
        v-if="item === 'associativeLine'"
        class="toolbarBtn"
        :class="{
          disabled: activeNodes.length <= 0 || hasGeneralization
        }"
        @click="$bus.$emit('createAssociativeLine')"
      >
        <span class="icon iconfont iconlianjiexian"></span>
        <span class="text">{{ $t('toolbar.associativeLine') }}</span>
      </div>
      <div
        v-if="item === 'formula'"
        class="toolbarBtn"
        :class="{
          disabled: activeNodes.length <= 0 || hasGeneralization
        }"
        @click="showFormula"
      >
        <span class="icon iconfont icongongshi"></span>
        <span class="text">{{ $t('toolbar.formula') }}</span>
      </div>
      <div
        v-if="item === 'attachment'"
        class="toolbarBtn"
        :class="{
          disabled: activeNodes.length <= 0 || hasGeneralization
        }"
        @click="selectAttachmentFile"
      >
        <span class="icon iconfont iconfujian"></span>
        <span class="text">{{ $t('toolbar.attachment') }}</span>
      </div>
      <div
        v-if="item === 'outerFrame'"
        class="toolbarBtn"
        :class="{
          disabled: activeNodes.length <= 0 || hasGeneralization
        }"
        @click="$bus.$emit('execCommand', 'ADD_OUTER_FRAME')"
      >
        <span class="icon iconfont iconwaikuang"></span>
        <span class="text">{{ $t('toolbar.outerFrame') }}</span>
      </div>
      <el-dropdown
        v-if="item === 'ai'"
        trigger="click"
        placement="bottom"
        @command="handleAiCommand"
        popper-class="ai-model-dropdown"
      >
        <div class="toolbarBtn ai-toolbar-btn">
          <span class="icon iconfont iconAI"></span>
          <span class="text">{{ currentAiModel ? currentAiModel.name : $t('ai.ai') }}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </div>
        <el-dropdown-menu slot="dropdown" class="ai-model-menu">
          <div class="ai-model-header">
            <span>{{ $t('ai.selectModel') }}</span>
          </div>
          <el-dropdown-item 
            v-for="model in availableAiModels" 
            :key="model.id"
            :command="{ type: 'selectModel', model }"
            :class="{ 'is-active': isCurrentAiModel(model.id) }"
            class="ai-model-item"
          >
            <div class="ai-model-item-content">
              <span class="ai-model-name">{{ model.name }}</span>
              <span class="ai-model-provider">{{ model.provider }}</span>
              <i v-if="isCurrentAiModel(model.id)" class="el-icon-check"></i>
            </div>
          </el-dropdown-item>
          <el-dropdown-item divided class="ai-model-settings" :command="{ type: 'openSettings' }">
            <i class="el-icon-setting"></i>
            <span>{{ $t('ai.settings') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
  </div>
</template>

<script>
  // ...
</script>

<style lang="less" scoped>
.toolbarNodeBtnList {
  display: flex;
  
  .ai-model-dropdown {
    padding: 8px 0;
    min-width: 220px;
    
    .ai-model-header {
      padding: 8px 16px;
      font-size: 12px;
      color: #909399;
      border-bottom: 1px solid #EBEEF5;
      margin-bottom: 4px;
    }
    
    .ai-model-menu {
      padding: 4px 0;
      min-width: 220px;
      border: none;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      
      .ai-model-item {
        display: flex;
        align-items: center;
        padding: 0;
        line-height: normal;
        
        &.is-active {
          color: #409EFF;
          background-color: #f0f7ff;
        }
        
        .ai-model-item-content {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          width: 100%;
        }
        
        .ai-model-name {
          flex: 1;
          margin-right: 8px;
        }
        
        .ai-model-provider {
          font-size: 12px;
          color: #909399;
          margin-right: 8px;
        }
        
        .el-icon-check {
          margin-left: 8px;
          color: #409EFF;
        }
      }
      
      .ai-model-settings {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        color: #606266;
        cursor: pointer;
        transition: background-color 0.2s;
        
        &:hover {
          background-color: #f5f7fa;
        }
        
        .el-icon-setting {
          margin-right: 8px;
          font-size: 14px;
        }
      }
    }
  }
  
  .toolbarBtn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 60px;
    height: 60px;
    cursor: pointer;
    color: #666;
    font-size: 12px;
    transition: all 0.2s;
    margin-right: 20px;
    
    &:last-of-type {
      margin-right: 0;
    }
    
    &:hover {
      &:not(.disabled) {
        .icon {
          background: #f5f5f5;
        }
      }
    }
    
    &.active {
      .icon {
        background: #f5f5f5;
      }
    }
    
    &.has-dropdown {
      .el-icon-arrow-down {
        position: absolute;
        right: 4px;
        bottom: 4px;
        font-size: 10px;
        opacity: 0.7;
      }
    }
    
    &.disabled {
      color: #bcbcbc;
      cursor: not-allowed;
      pointer-events: none;
      
      &:hover {
        background-color: transparent;
      }
    }

    .icon {
      display: flex;
      height: 26px;
      background: #fff;
      border-radius: 4px;
      border: 1px solid #e9e9e9;
      justify-content: center;
      flex-direction: column;
      text-align: center;
      padding: 0 5px;
    }

    .text {
      margin-top: 3px;
      text-align: center;
    }
  }

  // Vertical layout for sidebar
  &.v {
    display: block;
    width: 120px;
    flex-wrap: wrap;

    .toolbarBtn {
      flex-direction: row;
      justify-content: flex-start;
      margin-bottom: 10px;
      width: 100%;
      margin-right: 0;
      height: auto;
      padding: 8px 10px;

      &:last-of-type {
        margin-bottom: 0;
      }

      .icon {
        margin-right: 10px;
      }

      .text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .el-icon-arrow-down {
        position: static;
        margin-left: auto;
        font-size: 12px;
        opacity: 0.7;
      }
    }
  }

  // Dark mode styles
  &.isDark {
    .toolbarBtn {
      color: hsla(0, 0%, 100%, 0.9);

      .icon {
        background: transparent;
        border-color: transparent;
      }

      &:hover {
        &:not(.disabled) {
          .icon {
            background: hsla(0, 0%, 100%, 0.05);
          }
        }
      }

      &.disabled {
        color: #54595f;
      }
    }
  }

  // Dark theme overrides
  &.is-dark {
    background-color: #2d2d2d;
    border-color: #4c4c4c;

    .ai-model-list {
      .ai-model-item {
        color: #e4e7ed;
        
        .ai-model-divider {
          background-color: #4c4c4c;
        }
        
        .ai-model-settings {
          color: #a0a0a0;
          
          &:hover {
            background-color: #363636;
          }
        }
      }
    }
  }
}
</style>
