import { Message } from '@/store/chat-store';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODELS_URL = 'https://openrouter.ai/api/v1/models';

export interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | Array<{
    type: 'text' | 'image_url';
    text?: string;
    image_url?: {
      url: string;
    };
  }>;
}

export interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  context_length: number;
  pricing: {
    prompt: string;
    completion: string;
    image?: string;
  };
  top_provider?: {
    max_completion_tokens?: number;
    is_moderated?: boolean;
  };
  per_request_limits?: {
    prompt_tokens?: string;
    completion_tokens?: string;
  };
  architecture?: {
    modality?: string;
    tokenizer?: string;
    instruct_type?: string;
  };
}

export interface OpenRouterRequestOptions {
  apiKey: string;
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  top_p?: number;
  stream?: boolean;
  dataCollection?: 'allow' | 'deny';
  trainingData?: 'allow' | 'deny';
  outputPublishing?: 'allow' | 'deny';
}

// Fetch available models from OpenRouter API
export async function fetchOpenRouterModels(apiKey?: string): Promise<OpenRouterModel[]> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // API key is optional for fetching models
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(OPENROUTER_MODELS_URL, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      console.error('Failed to fetch models:', response.statusText);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching OpenRouter models:', error);
    return [];
  }
}

export async function sendOpenRouterRequest({
  apiKey,
  model,
  messages,
  temperature = 0.7,
  top_p = 0.9,
  stream = true,
  dataCollection = 'allow',
  trainingData = 'allow',
  outputPublishing = 'allow',
}: OpenRouterRequestOptions) {
  console.log('Sending request to OpenRouter:', { 
    model, 
    apiKey: apiKey ? '***' : 'missing',
    dataCollection,
    trainingData,
    outputPublishing,
    messagesCount: messages.length
  });
  
  const requestBody = {
    model,
    messages,
    temperature,
    top_p,
    stream
  };
  
  // Validate API key format
  if (!apiKey || !apiKey.startsWith('sk-or-v1-')) {
    throw new Error('無効なAPIキー形式です。正しいOpenRouter APIキー（sk-or-v1-で始まる）を設定してください。');
  }
  
  const requestHeaders = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  
  console.log('Request headers:', requestHeaders);
  console.log('Request body:', requestBody);
  
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
      throw new Error(error.error?.message || 'Failed to fetch from OpenRouter API');
    }

    return response;
  } catch (error) {
    console.error('OpenRouter fetch error:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('ネットワークエラー: APIキーが無効か、ネットワーク接続に問題があります。設定画面でAPIキーを確認してください。');
    }
    throw error;
  }
}

export function convertMessagesToOpenRouterFormat(
  messages: Message[],
  includeSystemPrompt = false
): OpenRouterMessage[] {
  const openRouterMessages: OpenRouterMessage[] = [];

  if (includeSystemPrompt) {
    openRouterMessages.push({
      role: 'system',
      content: 'You are a helpful AI assistant.',
    });
  }

  for (const message of messages) {
    if (message.imageUrl) {
      openRouterMessages.push({
        role: message.role,
        content: [
          {
            type: 'text',
            text: message.content,
          },
          {
            type: 'image_url',
            image_url: {
              url: message.imageUrl,
            },
          },
        ],
      });
    } else {
      openRouterMessages.push({
        role: message.role,
        content: message.content,
      });
    }
  }

  return openRouterMessages;
}

export async function* streamOpenRouterResponse(response: Response) {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error('Response body is not readable');
  }

  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    
    // Keep the last incomplete line in the buffer
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') {
          return;
        }
        
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            yield content;
          }
        } catch (e) {
          // Ignore parsing errors for incomplete JSON
          console.warn('Failed to parse streaming data:', e);
        }
      }
    }
  }
}

export function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
