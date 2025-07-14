<template>
  <el-dialog
    class="aiConfigDialog"
    :title="$t('ai.AIConfiguration') + (currentProviderName ? ` - ${currentProviderName}` : '')"
    :visible.sync="aiConfigDialogVisible"
    width="750px"
    append-to-body
    :close-on-click-modal="false"
  >
    <div class="aiConfigBox">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleFormRef"
        label-width="160px"
        label-position="left"
      >
        <!-- AI Provider Selection -->
        <el-form-item :label="$t('ai.provider')" prop="provider" class="provider-selection">
          <el-select 
            v-model="ruleForm.provider" 
            :placeholder="$t('ai.selectProvider')"
            @change="handleProviderChange"
            style="width: 100%"
            filterable
          >
            <el-option 
              v-for="[key, name] in Object.entries(providerNames)" 
              :key="key" 
              :label="name" 
              :value="key"
            >
              <div class="provider-option">
                <span class="provider-name">{{ name }}</span>
                <span class="provider-id">{{ key }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <!-- Provider-specific Configuration -->
        <div v-if="showApiKeyField" class="provider-config-section">
          <!-- API Key -->
          <el-form-item 
            :label="$t('ai.apiKey')" 
            prop="apiKey"
            :rules="[
              { required: true, message: $t('ai.apiKeyRequired'), trigger: 'blur' }
            ]"
          >
            <el-input 
              v-model="ruleForm.apiKey" 
              :placeholder="$t('ai.enterApiKey')"
              show-password
              clearable
            >
              <template #suffix>
                <el-tooltip v-if="providerApiKeyHelp[ruleForm.provider]" :content="providerApiKeyHelp[ruleForm.provider]" placement="top">
                  <i class="el-icon-info" style="color: var(--el-color-primary); cursor: help;"></i>
                </el-tooltip>
              </template>
            </el-input>
          </el-form-item>

          <!-- Base URL (for self-hosted or custom endpoints) -->
          <el-form-item 
            v-if="showBaseUrlField"
            :label="$t('ai.baseUrl')" 
            prop="baseUrl"
            :rules="[
              { required: requiresBaseUrl, message: $t('ai.baseUrlRequired'), trigger: 'blur' }
            ]"
          >
            <el-input 
              v-model="ruleForm.baseUrl" 
              :placeholder="defaultBaseUrls[ruleForm.provider] || 'https://api.example.com/v1'"
              clearable
            ></el-input>
          </el-form-item>

          <!-- API Version (for Azure) -->
          <el-form-item 
            v-if="ruleForm.provider === AI_PROVIDERS.AZURE"
            :label="$t('ai.apiVersion')" 
            prop="apiVersion"
            :rules="[
              { required: true, message: $t('ai.apiVersionRequired'), trigger: 'blur' }
            ]"
          >
            <el-input 
              v-model="ruleForm.apiVersion" 
              placeholder="2023-05-15"
            ></el-input>
          </el-form-item>

          <!-- Deployment ID (for Azure) -->
          <el-form-item 
            v-if="ruleForm.provider === AI_PROVIDERS.AZURE"
            :label="$t('ai.deploymentId')" 
            prop="deploymentId"
            :rules="[
              { required: true, message: $t('ai.deploymentIdRequired'), trigger: 'blur' }
            ]"
          >
            <el-input 
              v-model="ruleForm.deploymentId" 
              placeholder="your-deployment-id"
            ></el-input>
          </el-form-item>
        </div>

        <!-- Model Selection -->
        <el-form-item 
          v-if="showModelSelection"
          :label="$t('ai.model')" 
          prop="model"
          :rules="[
            { required: true, message: $t('ai.modelRequired'), trigger: 'change' }
          ]"
        >
          <el-select 
            v-model="ruleForm.model" 
            :placeholder="$t('ai.selectModel')"
            style="width: 100%"
            filterable
          >
            <el-option 
              v-for="model in availableModels" 
              :key="model.id" 
              :label="model.name" 
              :value="model.id"
            >
              <div class="model-option">
                <span class="model-name">{{ model.name }}</span>
                <span class="model-id">{{ model.id }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <!-- Custom Model Input -->
        <el-form-item 
          v-if="showCustomModelInput"
          :label="$t('ai.customModel')" 
          prop="customModel"
          :rules="[
            { required: true, message: $t('ai.customModelRequired'), trigger: 'blur' }
          ]"
        >
          <el-input 
            v-model="ruleForm.customModel" 
            :placeholder="$t('ai.enterCustomModel')"
          ></el-input>
        </el-form-item>

        <!-- Advanced Settings Collapse -->
        <el-collapse v-model="activeNames" class="advanced-settings">
          <el-collapse-item :title="$t('ai.advancedSettings')" name="1">
            <!-- Temperature -->
            <el-form-item :label="$t('ai.temperature')" prop="temperature">
              <el-slider
                v-model="ruleForm.temperature"
                :min="0"
                :max="2"
                :step="0.1"
                show-stops
                :marks="temperatureMarks"
              ></el-slider>
              <div class="slider-tip">
                <span>{{ $t('ai.precise') }}</span>
                <span>{{ $t('ai.balanced') }}</span>
                <span>{{ $t('ai.creative') }}</span>
              </div>
            </el-form-item>

            <!-- Max Tokens -->
            <el-form-item :label="$t('ai.maxTokens')" prop="maxTokens">
              <el-input-number 
                v-model="ruleForm.maxTokens" 
                :min="100" 
                :max="maxMaxTokens" 
                :step="100"
                style="width: 100%"
                :placeholder="$t('ai.maxTokensPlaceholder')"
              ></el-input-number>
              <div class="slider-tip">
                <span>{{ $t('ai.maxTokensTip') }}</span>
              </div>
            </el-form-item>

            <!-- Top P -->
            <el-form-item :label="$t('ai.topP')" prop="topP">
              <el-slider
                v-model="ruleForm.topP"
                :min="0"
                :max="1"
                :step="0.1"
                show-stops
              ></el-slider>
              <div class="slider-tip">
                <span>{{ $t('ai.deterministic') }}</span>
                <span>{{ $t('ai.diverse') }}</span>
              </div>
            </el-form-item>

            <!-- Presence Penalty -->
            <el-form-item :label="$t('ai.presencePenalty')" prop="presencePenalty">
              <el-slider
                v-model="ruleForm.presencePenalty"
                :min="-2"
                :max="2"
                :step="0.1"
                :marks="penaltyMarks"
                show-stops
              ></el-slider>
            </el-form-item>

            <!-- Frequency Penalty -->
            <el-form-item :label="$t('ai.frequencyPenalty')" prop="frequencyPenalty">
              <el-slider
                v-model="ruleForm.frequencyPenalty"
                :min="-2"
                :max="2"
                :step="0.1"
                :marks="penaltyMarks"
                show-stops
              ></el-slider>
            </el-form-item>

            <!-- Timeout -->
            <el-form-item :label="$t('ai.timeout')" prop="timeout">
              <el-input-number 
                v-model="ruleForm.timeout" 
                :min="10" 
                :max="600" 
                :step="5"
                :formatter="value => `${value}s`"
                :parser="value => value.replace('s', '')"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>

        <!-- Provider-specific documentation links and help -->
        <div class="provider-help" v-if="currentProviderDocs || providerHelpText[ruleForm.provider]">
          <el-alert
            v-if="providerHelpText[ruleForm.provider]"
            :title="providerHelpText[ruleForm.provider]"
            type="info"
            :closable="false"
            show-icon
            class="provider-help-text"
          />
          
          <div class="provider-docs" v-if="currentProviderDocs">
            <el-link 
              type="primary" 
              :href="currentProviderDocs" 
              target="_blank"
              :underline="false"
              class="docs-link"
            >
              <i class="el-icon-link"></i> 
              {{ $t('ai.viewDocumentation', { provider: providerNames[ruleForm.provider] }) }}
              <i class="el-icon-arrow-right"></i>
            </el-link>
          </div>
        </div>
      </el-form>
    </div>
    
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel" :disabled="isSaving">{{ $t('ai.cancel') }}</el-button>
      <el-button 
        type="primary" 
        @click="confirm" 
        :loading="isSaving"
        :disabled="!isFormValid"
      >
        {{ isSaving ? $t('ai.saving') : $t('ai.save') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { 
  AI_PROVIDERS, 
  AI_PROVIDER_NAMES, 
  AI_MODELS, 
  DEFAULT_AI_PROVIDER,
  DEFAULT_AI_SETTINGS
} from '@/config/ai'

export default {
  model: {
    prop: 'visible',
    event: 'change'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      AI_PROVIDERS,
      isSaving: false,
      activeNames: ['1'],
      ruleForm: {
        provider: DEFAULT_AI_PROVIDER,
        apiKey: '',
        baseUrl: '',
        apiVersion: '2023-05-15',
        deploymentId: '',
        model: '',
        customModel: '',
        temperature: DEFAULT_AI_SETTINGS.temperature,
        maxTokens: DEFAULT_AI_SETTINGS.maxTokens,
        topP: DEFAULT_AI_SETTINGS.topP,
        frequencyPenalty: DEFAULT_AI_SETTINGS.frequencyPenalty,
        presencePenalty: DEFAULT_AI_SETTINGS.presencePenalty,
        timeout: 60
      },
      providerNames: AI_PROVIDER_NAMES,
      providerDocs: (function() {
        var docs = {};
        docs[AI_PROVIDERS.OPENAI] = 'https://platform.openai.com/docs/api-reference';
        docs[AI_PROVIDERS.ANTHROPIC] = 'https://docs.anthropic.com/claude/reference';
        docs[AI_PROVIDERS.DEEPSEEK] = 'https://platform.deepseek.com/docs';
        docs[AI_PROVIDERS.GOOGLE] = 'https://ai.google.dev/api/rest';
        docs[AI_PROVIDERS.MISTRAL] = 'https://docs.mistral.ai/';
        docs[AI_PROVIDERS.COHERE] = 'https://docs.cohere.com/reference';
        docs[AI_PROVIDERS.VOLCANO] = 'https://www.volcengine.com/docs/82379';
        docs[AI_PROVIDERS.GROQ] = 'https://console.groq.com/docs/introduction';
        docs[AI_PROVIDERS.OLLAMA] = 'https://github.com/ollama/ollama';
        docs[AI_PROVIDERS.LM_STUDIO] = 'https://lmstudio.ai/docs';
        docs[AI_PROVIDERS.TOGETHER] = 'https://docs.together.ai/reference';
        docs[AI_PROVIDERS.PERPLEXITY] = 'https://docs.perplexity.ai/';
        docs[AI_PROVIDERS.OPENROUTER] = 'https://openrouter.ai/docs';
        docs[AI_PROVIDERS.AZURE] = 'https://learn.microsoft.com/en-us/azure/ai-services/openai/';
        docs[AI_PROVIDERS.AWS] = 'https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html';
        return docs;
      })(),
      providerApiKeyHelp: (function() {
        var help = {};
        help[AI_PROVIDERS.OPENAI] = 'Find your API key at https://platform.openai.com/api-keys';
        help[AI_PROVIDERS.ANTHROPIC] = 'Find your API key at https://console.anthropic.com/settings/keys';
        help[AI_PROVIDERS.DEEPSEEK] = 'Find your API key at https://platform.deepseek.com/account/api-keys';
        help[AI_PROVIDERS.GOOGLE] = 'Get your API key from Google AI Studio';
        help[AI_PROVIDERS.MISTRAL] = 'Find your API key at https://console.mistral.ai/api-keys/';
        help[AI_PROVIDERS.COHERE] = 'Find your API key at https://dashboard.cohere.com/api-keys';
        help[AI_PROVIDERS.GROQ] = 'Find your API key at https://console.groq.com/keys';
        help[AI_PROVIDERS.OPENROUTER] = 'Find your API key at https://openrouter.ai/keys';
        help[AI_PROVIDERS.PERPLEXITY] = 'Find your API key at https://perplexity.ai/settings/api';
        help[AI_PROVIDERS.AZURE] = 'Find your API key in the Azure Portal';
        help[AI_PROVIDERS.AWS] = 'Configure AWS credentials with proper Bedrock permissions';
        return help;
      })(),
      providerHelpText: (function(vm) {
        var texts = {};
        texts[AI_PROVIDERS.OLLAMA] = vm.$t('ai.ollamaHelpText');
        texts[AI_PROVIDERS.LM_STUDIO] = vm.$t('ai.lmStudioHelpText');
        texts[AI_PROVIDERS.OPENROUTER] = vm.$t('ai.openRouterHelpText');
        return texts;
      })(this),
      defaultBaseUrls: (function() {
        var urls = {};
        urls[AI_PROVIDERS.OPENAI] = 'https://api.openai.com/v1';
        urls[AI_PROVIDERS.ANTHROPIC] = 'https://api.anthropic.com/v1';
        urls[AI_PROVIDERS.DEEPSEEK] = 'https://api.deepseek.com/v1';
        urls[AI_PROVIDERS.MISTRAL] = 'https://api.mistral.ai/v1';
        urls[AI_PROVIDERS.COHERE] = 'https://api.cohere.ai/v1';
        urls[AI_PROVIDERS.OLLAMA] = 'http://localhost:11434/v1';
        urls[AI_PROVIDERS.LM_STUDIO] = 'http://localhost:1234/v1';
        urls[AI_PROVIDERS.TOGETHER] = 'https://api.together.xyz/v1';
        urls[AI_PROVIDERS.OPENROUTER] = 'https://openrouter.ai/api/v1';
        urls[AI_PROVIDERS.PERPLEXITY] = 'https://api.perplexity.ai';
        urls[AI_PROVIDERS.AZURE] = 'https://{your-resource-name}.openai.azure.com/openai/deployments/{deployment-id}';
        return urls;
      })(),
      temperatureMarks: {
        0: '0',
        0.5: '0.5',
        1: '1',
        1.5: '1.5',
        2: '2'
      },
      penaltyMarks: {
        '-2': '-2',
        '-1': '-1',
        0: '0',
        1: '1',
        2: '2'
      },
      rules: {
        provider: [
          { required: true, message: this.$t('ai.providerRequired'), trigger: 'change' }
        ],
        apiKey: [
          { required: true, message: this.$t('ai.apiKeyRequired'), trigger: 'blur' }
        ],
        model: [
          { required: true, message: this.$t('ai.modelRequired'), trigger: 'change' }
        ]
      }
    }
  },
  computed: Object.assign({},
    mapState(['aiConfig']), {
      availableModels: function() {
        return AI_MODELS[this.ruleForm.provider] || [];
      },
      currentProviderName: function() {
        return this.providerNames[this.ruleForm.provider] || this.ruleForm.provider;
      },
      currentProviderDocs: function() {
        return this.providerDocs[this.ruleForm.provider];
      },
      showApiKeyField: function() {
        return ![
          AI_PROVIDERS.OLLAMA,
          AI_PROVIDERS.LM_STUDIO
        ].includes(this.ruleForm.provider);
      },
      showBaseUrlField: function() {
        return [
          AI_PROVIDERS.OPENAI,
          AI_PROVIDERS.ANTHROPIC,
          AI_PROVIDERS.DEEPSEEK,
          AI_PROVIDERS.MISTRAL,
          AI_PROVIDERS.COHERE,
          AI_PROVIDERS.OLLAMA,
          AI_PROVIDERS.LM_STUDIO,
          AI_PROVIDERS.TOGETHER,
          AI_PROVIDERS.OPENROUTER,
          AI_PROVIDERS.PERPLEXITY
        ].includes(this.ruleForm.provider);
      },
      requiresBaseUrl: function() {
        return [
          AI_PROVIDERS.OLLAMA,
          AI_PROVIDERS.LM_STUDIO
        ].includes(this.ruleForm.provider);
      },
      showModelSelection: function() {
        return this.availableModels && this.availableModels.length > 0;
      },
      showCustomModelInput: function() {
        return [
          AI_PROVIDERS.OLLAMA,
          AI_PROVIDERS.LM_STUDIO
        ].includes(this.ruleForm.provider);
      },
      maxMaxTokens: function() {
        // Some models support larger context windows
        return this.ruleForm.provider === AI_PROVIDERS.ANTHROPIC ? 100000 : 4000;
      },
      isFormValid: function() {
        if (!this.ruleForm.provider) return false;
        if (this.showApiKeyField && !this.ruleForm.apiKey) return false;
        if (this.requiresBaseUrl && !this.ruleForm.baseUrl) return false;
        if (this.ruleForm.provider === AI_PROVIDERS.AZURE && 
            (!this.ruleForm.apiVersion || !this.ruleForm.deploymentId)) {
          return false;
        }
        return true;
      }
    }
  ),
  watch: {
    visible: function(val) {
      this.aiConfigDialogVisible = val;
    },
    aiConfigDialogVisible: function(val, oldVal) {
      if (!val && oldVal) {
        this.close();
      } else if (val) {
        this.initFormData();
      }
    },
    'ruleForm.provider': function() {
      // Reset model when provider changes
      this.ruleForm.model = (this.availableModels[0] && this.availableModels[0].id) || '';
      
      // Set default base URL for the provider if not set
      if (this.showBaseUrlField && !this.ruleForm.baseUrl) {
        this.ruleForm.baseUrl = this.defaultBaseUrls[this.ruleForm.provider] || '';
      }
    }
  },
  created: function() {
    this.initFormData();
  },
  methods: {
    ...mapMutations(['setLocalConfig']),

    close() {
      this.$emit('change', false)
    },

    initFormData() {
      if (!this.aiConfig) return
      
      // Copy relevant AI config to form
      const {
        provider = DEFAULT_AI_PROVIDER,
        apiKey = '',
        baseUrl = '',
        apiVersion = '2023-05-15',
        deploymentId = '',
        model = '',
        customModel = '',
        temperature = DEFAULT_AI_SETTINGS.temperature,
        maxTokens = DEFAULT_AI_SETTINGS.maxTokens,
        topP = DEFAULT_AI_SETTINGS.topP,
        frequencyPenalty = DEFAULT_AI_SETTINGS.frequencyPenalty,
        presencePenalty = DEFAULT_AI_SETTINGS.presencePenalty,
        timeout = 60
      } = this.aiConfig
      
      this.ruleForm = {
        provider,
        apiKey,
        baseUrl: baseUrl || this.defaultBaseUrls[provider] || '',
        apiVersion,
        deploymentId,
        model: model || (this.availableModels[0] && this.availableModels[0].id) || '',
        customModel,
        temperature: parseFloat(temperature),
        maxTokens: parseInt(maxTokens),
        topP: parseFloat(topP),
        frequencyPenalty: parseFloat(frequencyPenalty),
        presencePenalty: parseFloat(presencePenalty),
        timeout: parseInt(timeout) || 60
      }
      
      // Ensure model is set to a valid value
      if (!this.ruleForm.model && this.availableModels.length > 0) {
        this.ruleForm.model = this.availableModels[0].id
      }
    },

    handleProviderChange(provider) {
      // Reset model when provider changes
      this.ruleForm.model = this.availableModels[0]?.id || ''
      
      // Set default base URL for the provider if not set
      if (this.showBaseUrlField && !this.ruleForm.baseUrl) {
        this.ruleForm.baseUrl = this.defaultBaseUrls[provider] || ''
      }
    },

    cancel() {
      this.close()
      this.initFormData()
    },

    async confirm() {
      this.isSaving = true
      
      try {
        await this.$refs.ruleFormRef.validate()
        
        const config = {
          ...this.ruleForm,
          // Ensure we don't save undefined values
          apiKey: this.ruleForm.apiKey || '',
          model: this.ruleForm.model || (this.availableModels[0] && this.availableModels[0].id) || '',
          baseUrl: this.ruleForm.baseUrl || this.defaultBaseUrls[this.ruleForm.provider] || '',
          // Clean up empty values
          ...(this.ruleForm.apiVersion ? { apiVersion: this.ruleForm.apiVersion } : {}),
          ...(this.ruleForm.deploymentId ? { deploymentId: this.ruleForm.deploymentId } : {})
        }
        
        // Remove custom model if not needed
        if (!this.showCustomModelInput) {
          delete config.customModel
        }
        
        this.setLocalConfig(config)
        this.$message.success(this.$t('ai.configSaveSuccessTip'))
        this.close()
      } catch (error) {
        console.error('Validation failed:', error)
      } finally {
        this.isSaving = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.aiConfigDialog {
  /deep/ .el-dialog__body {
    padding: 20px 30px;
    max-height: 80vh;
    overflow-y: auto;
  }

  .aiConfigBox {
    a {
      color: #409eff;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }

    .provider-selection {
      margin-bottom: 24px;
      
      /deep/ .el-input__inner {
        height: 40px;
        line-height: 40px;
      }
    }

    .provider-option {
      display: flex;
      justify-content: space-between;
      width: 100%;
      
      .provider-name {
        font-weight: 500;
      }
      
      .provider-id {
        color: #909399;
        font-size: 12px;
        margin-left: 10px;
      }
    }

    .model-option {
      display: flex;
      justify-content: space-between;
      width: 100%;
      
      .model-name {
        font-weight: 500;
      }
      
      .model-id {
        color: #909399;
        font-size: 12px;
        margin-left: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 60%;
      }
    }

    .slider-tip {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      font-size: 12px;
      color: #909399;
    }

    .provider-help {
      margin-top: 24px;
      border-top: 1px solid #ebeef5;
      padding-top: 16px;

      .provider-help-text {
        margin-bottom: 16px;
      }

      .docs-link {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
      }
    }

    .advanced-settings {
      margin-top: 16px;
      border: 1px solid #ebeef5;
      border-radius: 4px;
      overflow: hidden;

      /deep/ .el-collapse-item__header {
        padding: 0 16px;
        height: 48px;
        line-height: 48px;
        background-color: #f5f7fa;
        font-weight: 500;
      }

      /deep/ .el-collapse-item__content {
        padding: 16px;
      }
    }

    .title {
      margin: 20px 0 15px;
      font-weight: 600;
      font-size: 16px;
      color: #303133;
      
      &:first-child {
        margin-top: 0;
      }
    }

    .desc {
      margin: 0 0 20px;
      padding: 10px 15px;
      background-color: #f5f7fa;
      border-radius: 4px;
      font-size: 14px;
      color: #606266;
      line-height: 1.5;
    }
    
    .slider-tip {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      font-size: 12px;
      color: #909399;
    }
    
    .provider-docs {
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px solid #ebeef5;
      text-align: center;
      
      .el-link {
        font-size: 13px;
        
        i {
          margin-right: 5px;
        }
      }
    }
    
    /deep/ .el-collapse-item__header {
      padding-left: 10px;
      font-weight: 600;
      font-size: 14px;
      color: #303133;
      background-color: #f5f7fa;
      border-radius: 4px;
    }
    
    /deep/ .el-collapse-item__wrap {
      padding: 15px 10px;
      background-color: #fff;
      border-bottom: none;
    }
    
    /deep/ .el-form-item {
      margin-bottom: 20px;
      
      &:last-child {
        margin-bottom: 10px;
      }
    }
  }
  
  .dialog-footer {
    text-align: right;
    padding: 15px 20px 20px;
    
    .el-button + .el-button {
      margin-left: 10px;
    }
  }
}

/* Dark mode styles */
.isDark {
  .aiConfigDialog {
    /deep/ .el-dialog {
      background-color: #2d2d2d;
      color: #e4e7ed;
    }
    
    /deep/ .el-dialog__title {
      color: #e4e7ed;
    }
    
    /deep/ .el-form-item__label {
      color: #a3a6ad;
    }
    
    /deep/ .el-input__inner,
    /deep/ .el-textarea__inner {
      background-color: #3d3d3d;
      border-color: #4c4c4c;
      color: #e4e7ed;
      
      &::placeholder {
        color: #6c6c6c;
      }
    }
    
    /deep/ .el-select-dropdown {
      background-color: #3d3d3d;
      border-color: #4c4c4c;
      
      .el-select-dropdown__item {
        color: #e4e7ed;
        
        &:hover, 
        &.hover {
          background-color: #4c4c4c;
        }
        
        &.selected {
          color: #409eff;
          background-color: #1e2b3a;
        }
      }
    }
    
    /deep/ .el-collapse-item__header {
      background-color: #3d3d3d;
      color: #e4e7ed;
      border-bottom-color: #4c4c4c;
    }
    
    /deep/ .el-collapse-item__wrap {
      background-color: #2d2d2d;
      border-bottom-color: #4c4c4c;
    }
    
    .slider-tip {
      color: #8d8d8d;
    }
    
    .provider-docs {
      border-top-color: #4c4c4c;
    }
  }
}
</style>
