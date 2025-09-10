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

// Free models will be populated dynamically from API
export let FREE_MODELS: ModelInfo[] = [];

// Premium models will be populated dynamically from API
export let PREMIUM_MODELS: ModelInfo[] = [];

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
    'moonshotai': 'Moonshot AI',
    'qwen': 'Qwen',
    'z-ai': 'Zhipu AI',
    'tencent': 'Tencent',
    'cognitivecomputations': 'Cognitive Computations',
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
    
    // Get free models
    const freeModels = convertedModels
      .filter(m => m.isFree)
      .sort((a, b) => {
        // Sort by provider and then by name
        const providerOrder = ['OpenAI', 'Google', 'Anthropic', 'Meta', 'xAI', 'DeepSeek', 'Moonshot AI', 'Others'];
        const aOrder = providerOrder.indexOf(a.provider) !== -1 ? providerOrder.indexOf(a.provider) : 999;
        const bOrder = providerOrder.indexOf(b.provider) !== -1 ? providerOrder.indexOf(b.provider) : 999;
        
        if (aOrder !== bOrder) return aOrder - bOrder;
        return a.name.localeCompare(b.name);
      });

    // Debug: Check for Gemini free models specifically
    const geminiFreeModels = freeModels.filter(m => 
      m.provider === 'Google' && m.id.includes('gemini')
    );
    console.log(`Gemini free models found: ${geminiFreeModels.length}`);
    geminiFreeModels.forEach(model => {
      console.log(`  - ${model.id} (${model.provider}) - ${model.name}`);
    });
    
    // Get premium models with more inclusive filtering
    const sortedPremiumModels = convertedModels
      .filter(m => !m.isFree)
      .filter(m => {
        // More inclusive filter - include most modern models
        const id = m.id.toLowerCase();
        const name = m.name.toLowerCase();
        
        return (
          // OpenAI models - include all GPT variants
          id.includes('gpt') || id.includes('o1') || id.includes('o3') ||
          // Anthropic models
          id.includes('claude') ||
          // Google models
          id.includes('gemini') ||
          // Meta models
          id.includes('llama') ||
          // xAI models
          id.includes('grok') ||
          // DeepSeek models
          id.includes('deepseek') ||
          // Mistral models
          id.includes('mistral') || id.includes('mixtral') ||
          // Qwen models
          id.includes('qwen') ||
          // Moonshot models
          id.includes('moonshot') || id.includes('kimi') ||
          // Other AI21 models
          id.includes('jamba') ||
          // Command R models
          id.includes('command-r') ||
          // Phi models
          id.includes('phi') ||
          // Claude name variations
          name.includes('sonnet') || name.includes('opus') || name.includes('haiku') ||
          // Other popular models
          id.includes('nova') || id.includes('titan') || id.includes('wizard') ||
          id.includes('orca') || id.includes('dolphin') || id.includes('alpaca') ||
          // Provider-based inclusion for major providers
          id.startsWith('openai/') || id.startsWith('anthropic/') || 
          id.startsWith('google/') || id.startsWith('meta-llama/') ||
          id.startsWith('x-ai/') || id.startsWith('mistralai/') ||
          id.startsWith('deepseek/') || id.startsWith('qwen/') ||
          id.startsWith('moonshotai/')
        );
      })
      .sort((a, b) => {
        // Sort by provider and then by name
        const providerOrder = ['OpenAI', 'Anthropic', 'Google', 'Meta', 'xAI', 'DeepSeek', 'Mistral', 'Others'];
        const aOrder = providerOrder.indexOf(a.provider) !== -1 ? providerOrder.indexOf(a.provider) : 999;
        const bOrder = providerOrder.indexOf(b.provider) !== -1 ? providerOrder.indexOf(b.provider) : 999;
        
        if (aOrder !== bOrder) return aOrder - bOrder;
        return a.name.localeCompare(b.name);
      });

    // Select models with balanced representation from major providers
    const selectedModels: ModelInfo[] = [];
    const maxPerProvider = 8; // Limit per provider to ensure variety
    const providerCounts: Record<string, number> = {};
    
    for (const model of sortedPremiumModels) {
      const count = providerCounts[model.provider] || 0;
      if (count < maxPerProvider) {
        selectedModels.push(model);
        providerCounts[model.provider] = count + 1;
      }
      
      // Stop when we have enough models
      if (selectedModels.length >= 60) break;
    }
    
    const premiumModels = selectedModels;

    // Update global models list
    FREE_MODELS = freeModels;
    PREMIUM_MODELS = premiumModels;
    AVAILABLE_MODELS = [...FREE_MODELS, ...PREMIUM_MODELS];
    
    console.log(`Updated models: ${FREE_MODELS.length} free, ${PREMIUM_MODELS.length} premium`);
    
    // Debug: Check for xAI models specifically
    const xaiModels = PREMIUM_MODELS.filter(m => m.provider === 'xAI' || m.id.includes('x-ai'));
    console.log(`xAI models found: ${xaiModels.length}`);
    xaiModels.forEach(model => {
      console.log(`  - ${model.id} (${model.provider})`);
    });

    // Debug: Check for all Google models in both free and premium
    const allGoogleModels = AVAILABLE_MODELS.filter(m => m.provider === 'Google');
    const googleFreeModels = allGoogleModels.filter(m => m.isFree);
    const googlePremiumModels = allGoogleModels.filter(m => !m.isFree);
    console.log(`Google models: ${allGoogleModels.length} total (${googleFreeModels.length} free, ${googlePremiumModels.length} premium)`);
    console.log('Google free models:');
    googleFreeModels.forEach(model => {
      console.log(`  - ${model.id} - ${model.name}`);
    });
  } catch (error) {
    console.error('Failed to update models:', error);
  }
}

export function getModelById(modelId: string): ModelInfo | undefined {
  return AVAILABLE_MODELS.find(model => model.id === modelId);
}

export function getDefaultModelForImage(): string {
  // Try to find a free image-capable model, fallback to a known one
  const imageModel = AVAILABLE_MODELS.find(m => m.isFree && m.supportsImages);
  return imageModel?.id || 'google/gemini-2.0-flash-exp:free';
}

export function getDefaultModelForText(): string {
  // Try to find a free text model, fallback to a known one
  const textModel = AVAILABLE_MODELS.find(m => m.isFree);
  return textModel?.id || 'openai/gpt-oss-120b:free';
}
