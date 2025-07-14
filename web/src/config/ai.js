// AI Provider Configuration
export const AI_PROVIDERS = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  DEEPSEEK: 'deepseek',
  GOOGLE: 'google',
  MISTRAL: 'mistral',
  COHERE: 'cohere',
  VOLCANO: 'volcano',
  GROQ: 'groq',
  OLLAMA: 'ollama',
  LM_STUDIO: 'lmstudio',
  TOGETHER: 'together',
  PERPLEXITY: 'perplexity',
  OPENROUTER: 'openrouter',
  AZURE: 'azure',
  AWS: 'aws'
}

export const AI_PROVIDER_NAMES = {
  [AI_PROVIDERS.OPENAI]: 'OpenAI',
  [AI_PROVIDERS.ANTHROPIC]: 'Anthropic (Claude)',
  [AI_PROVIDERS.DEEPSEEK]: 'DeepSeek',
  [AI_PROVIDERS.GOOGLE]: 'Google (Gemini)',
  [AI_PROVIDERS.MISTRAL]: 'Mistral AI',
  [AI_PROVIDERS.COHERE]: 'Cohere',
  [AI_PROVIDERS.VOLCANO]: 'Volcano Ark',
  [AI_PROVIDERS.GROQ]: 'Groq',
  [AI_PROVIDERS.OLLAMA]: 'Ollama',
  [AI_PROVIDERS.LM_STUDIO]: 'LM Studio',
  [AI_PROVIDERS.TOGETHER]: 'Together AI',
  [AI_PROVIDERS.PERPLEXITY]: 'Perplexity',
  [AI_PROVIDERS.OPENROUTER]: 'OpenRouter',
  [AI_PROVIDERS.AZURE]: 'Azure OpenAI',
  [AI_PROVIDERS.AWS]: 'AWS Bedrock'
}

export const DEFAULT_AI_PROVIDER = AI_PROVIDERS.OPENAI

export const AI_MODELS = {
  [AI_PROVIDERS.OPENAI]: [
    { id: 'gpt-4o', name: 'GPT-4o (Latest)' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
    { id: 'gpt-3.5-turbo-16k', name: 'GPT-3.5 Turbo 16K' }
  ],
  [AI_PROVIDERS.ANTHROPIC]: [
    { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
    { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet' },
    { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' },
    { id: 'claude-2.1', name: 'Claude 2.1' }
  ],
  [AI_PROVIDERS.DEEPSEEK]: [
    { id: 'deepseek-chat', name: 'DeepSeek Chat' },
    { id: 'deepseek-coder', name: 'DeepSeek Coder' },
    { id: 'deepseek-chat-32k', name: 'DeepSeek Chat 32K' }
  ],
  [AI_PROVIDERS.GOOGLE]: [
    { id: 'gemini-pro', name: 'Gemini Pro' },
    { id: 'gemini-pro-vision', name: 'Gemini Pro Vision' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' }
  ],
  [AI_PROVIDERS.MISTRAL]: [
    { id: 'mistral-tiny', name: 'Mistral Tiny' },
    { id: 'mistral-small', name: 'Mistral Small' },
    { id: 'mistral-medium', name: 'Mistral Medium' },
    { id: 'mistral-large', name: 'Mistral Large' },
    { id: 'mixtral-8x7b', name: 'Mixtral 8x7B' }
  ],
  [AI_PROVIDERS.COHERE]: [
    { id: 'command-r-plus', name: 'Command R+' },
    { id: 'command-r', name: 'Command R' },
    { id: 'command', name: 'Command' }
  ],
  [AI_PROVIDERS.VOLCANO]: [
    { id: 'volc-ark', name: 'Volcano Ark' },
    { id: 'volc-ark-2.0', name: 'Volcano Ark 2.0' }
  ],
  [AI_PROVIDERS.GROQ]: [
    { id: 'llama3-70b-8192', name: 'Llama 3 70B' },
    { id: 'llama3-8b-8192', name: 'Llama 3 8B' },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B' },
    { id: 'gemma-7b-it', name: 'Gemma 7B' }
  ],
  [AI_PROVIDERS.OLLAMA]: [
    { id: 'llama3', name: 'Llama 3' },
    { id: 'mistral', name: 'Mistral' },
    { id: 'gemma', name: 'Gemma' },
    { id: 'phi', name: 'Phi' }
  ],
  [AI_PROVIDERS.LM_STUDIO]: [
    { id: 'local', name: 'Local Model' }
  ],
  [AI_PROVIDERS.TOGETHER]: [
    { id: 'meta-llama/Llama-3-70b-chat-hf', name: 'Llama 3 70B Chat' },
    { id: 'mistralai/Mixtral-8x7B-Instruct-v0.1', name: 'Mixtral 8x7B Instruct' },
    { id: 'Qwen/Qwen1.5-72B-Chat', name: 'Qwen 1.5 72B Chat' }
  ],
  [AI_PROVIDERS.PERPLEXITY]: [
    { id: 'sonar-small-chat', name: 'Sonar Small Chat' },
    { id: 'sonar-medium-chat', name: 'Sonar Medium Chat' },
    { id: 'mixtral-8x7b-instruct', name: 'Mixtral 8x7B Instruct' }
  ],
  [AI_PROVIDERS.OPENROUTER]: [
    { id: 'openai/gpt-4o', name: 'OpenAI GPT-4o' },
    { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus' },
    { id: 'google/gemini-pro', name: 'Google Gemini Pro' }
  ],
  [AI_PROVIDERS.AZURE]: [
    { id: 'gpt-4', name: 'Azure OpenAI GPT-4' },
    { id: 'gpt-35-turbo', name: 'Azure OpenAI GPT-3.5' }
  ],
  [AI_PROVIDERS.AWS]: [
    { id: 'anthropic.claude-3-sonnet-20240229-v1:0', name: 'Claude 3 Sonnet' },
    { id: 'anthropic.claude-3-haiku-20240307-v1:0', name: 'Claude 3 Haiku' },
    { id: 'meta.llama3-70b-instruct-v1:0', name: 'Llama 3 70B Instruct' }
  ]
}

export const getDefaultModel = (provider) => {
  return AI_MODELS[provider]?.[0]?.id || ''
}

export const DEFAULT_AI_SETTINGS = {
  temperature: 0.7,
  maxTokens: 2000,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0
}
