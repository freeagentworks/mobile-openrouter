import { OpenRouterModel, fetchOpenRouterModels } from './openrouter';

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  contextLength: number;
  supportsImages: boolean;
  isFree: boolean;
  pricing?: {
    prompt: string;
    completion: string;
  };
}

// Fixed free model IDs - these are commonly available free models on OpenRouter
export const FREE_MODELS: ModelInfo[] = [
  {
    id: 'openai/gpt-oss-120b:free',
    name: 'GPT-OSS 120B (Free)',
    provider: 'OpenAI',
    contextLength: 128000,
    supportsImages: false,
    isFree: true,
  },
  {
    id: 'deepseek/deepseek-chat-v3.1:free',
    name: 'DeepSeek V3.1 (Free)',
    provider: 'DeepSeek',
    contextLength: 128000,
    supportsImages: false,
    isFree: true,
  },
  {
    id: 'google/gemini-2.0-flash-exp:free',
    name: 'Gemini 2.0 Flash Exp (Free)',
    provider: 'Google',
    contextLength: 1048576,
    supportsImages: true,
    isFree: true,
  },
  {
    id: 'google/gemini-1.5-flash:free',
    name: 'Gemini 1.5 Flash (Free)',
    provider: 'Google',
    contextLength: 1048576,
    supportsImages: true,
    isFree: true,
  },
  {
    id: 'mistralai/mistral-7b-instruct:free',
    name: 'Mistral 7B Instruct (Free)',
    provider: 'Mistral',
    contextLength: 32768,
    supportsImages: false,
    isFree: true,
  },
  {
    id: 'meta-llama/llama-3.2-90b-vision-instruct:free',
    name: 'Llama 3.2 90B Vision (Free)',
    provider: 'Meta',
    contextLength: 128000,
    supportsImages: true,
    isFree: true,
  },
  {
    id: 'microsoft/phi-3-medium-128k-instruct:free',
    name: 'Phi-3 Medium 128K (Free)',
    provider: 'Microsoft',
    contextLength: 128000,
    supportsImages: false,
    isFree: true,
  },
];

// Default premium models (will be updated dynamically)
export let PREMIUM_MODELS: ModelInfo[] = [
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    contextLength: 128000,
    supportsImages: true,
    isFree: false,
  },
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    contextLength: 200000,
    supportsImages: true,
    isFree: false,
  },
  {
    id: 'google/gemini-pro-1.5',
    name: 'Gemini Pro 1.5',
    provider: 'Google',
    contextLength: 2097152,
    supportsImages: true,
    isFree: false,
  },
];

// Combine free and premium models
export let AVAILABLE_MODELS: ModelInfo[] = [...FREE_MODELS, ...PREMIUM_MODELS];

// Convert OpenRouter model to our ModelInfo format
function convertOpenRouterModel(model: OpenRouterModel): ModelInfo {
  const isFree = model.id.endsWith(':free') || model.pricing.prompt === '0';
  const supportsImages = model.architecture?.modality === 'multimodal' || 
                         model.id.includes('vision') || 
                         model.id.includes('gpt-4o') ||
                         model.id.includes('claude') ||
                         model.id.includes('gemini');
  
  // Extract provider from model ID
  const provider = model.id.split('/')[0];
  const providerNames: Record<string, string> = {
    'openai': 'OpenAI',
    'anthropic': 'Anthropic',
    'google': 'Google',
    'meta-llama': 'Meta',
    'mistralai': 'Mistral',
    'microsoft': 'Microsoft',
    'nousresearch': 'NousResearch',
    'cohere': 'Cohere',
    'deepseek': 'DeepSeek',
    'x-ai': 'xAI',
  };

  return {
    id: model.id,
    name: model.name || model.id,
    provider: providerNames[provider] || provider,
    contextLength: model.context_length,
    supportsImages,
    isFree,
    pricing: {
      prompt: model.pricing.prompt,
      completion: model.pricing.completion,
    },
  };
}

// Update available models from OpenRouter API
export async function updateAvailableModels(apiKey?: string): Promise<void> {
  try {
    const models = await fetchOpenRouterModels(apiKey);
    
    if (models.length === 0) {
      console.warn('No models fetched from OpenRouter, using defaults');
      return;
    }

    // Filter and sort models
    const convertedModels = models.map(convertOpenRouterModel);
    
    // Get premium models (excluding free ones)
    const premiumModels = convertedModels
      .filter(m => !m.isFree)
      .filter(m => {
        // Filter for latest models
        const id = m.id.toLowerCase();
        return (
          // Latest GPT models (GPT-4o, GPT-5, o1 series)
          (id.includes('gpt-4o') || id.includes('gpt-5') || id.includes('o1')) ||
          // Latest Claude models (3.5, 4.x series)
          (id.includes('claude') && (id.includes('3.5') || id.includes('4'))) ||
          // Latest Gemini models (2.0, 2.5 series)
          (id.includes('gemini') && (id.includes('2.0') || id.includes('2.5') || id.includes('pro'))) ||
          // Latest Llama models
          (id.includes('llama') && (id.includes('3.3') || id.includes('3.2'))) ||
          // Other notable models
          id.includes('deepseek') ||
          id.includes('command-r') ||
          id.includes('grok')
        );
      })
      .sort((a, b) => {
        // Sort by provider and then by name
        const providerOrder = ['OpenAI', 'Anthropic', 'Google', 'Meta', 'xAI', 'Others'];
        const aOrder = providerOrder.indexOf(a.provider) !== -1 ? providerOrder.indexOf(a.provider) : 999;
        const bOrder = providerOrder.indexOf(b.provider) !== -1 ? providerOrder.indexOf(b.provider) : 999;
        
        if (aOrder !== bOrder) return aOrder - bOrder;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 25); // Limit to top 25 premium models

    // Update global models list
    PREMIUM_MODELS = premiumModels;
    AVAILABLE_MODELS = [...FREE_MODELS, ...PREMIUM_MODELS];
    
    console.log(`Updated models: ${FREE_MODELS.length} free, ${PREMIUM_MODELS.length} premium`);
  } catch (error) {
    console.error('Failed to update models:', error);
  }
}

export function getModelById(modelId: string): ModelInfo | undefined {
  return AVAILABLE_MODELS.find(model => model.id === modelId);
}

export function getDefaultModelForImage(): string {
  // Use a free image-capable model as default
  return 'google/gemini-2.0-flash-exp:free';
}

export function getDefaultModelForText(): string {
  // Use a free text model as default
  return 'openai/gpt-oss-120b:free';
}
