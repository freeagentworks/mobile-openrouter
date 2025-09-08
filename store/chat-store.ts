import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  timestamp: Date;
  model?: string;
}

export interface ChatStore {
  // Messages
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  
  // API Settings
  apiKey: string;
  setApiKey: (key: string) => void;
  
  // Model Selection
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  
  // LLM Parameters
  temperature: number;
  setTemperature: (temp: number) => void;
  topP: number;
  setTopP: (value: number) => void;
  
  // UI State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const DEFAULT_TEXT_MODEL = 'openai/gpt-oss-120b:free';
const DEFAULT_IMAGE_MODEL = 'meta-llama/llama-4-maverick:free';

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      // Messages
      messages: [],
      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...message,
              id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              timestamp: new Date(),
            },
          ],
        })),
      clearMessages: () => set({ messages: [] }),
      
      // API Settings
      apiKey: '',
      setApiKey: (key) => set({ apiKey: key }),
      
      // Model Selection
      selectedModel: DEFAULT_TEXT_MODEL,
      setSelectedModel: (model) => set({ selectedModel: model }),
      
      // LLM Parameters
      temperature: 0.7,
      setTemperature: (temp) => set({ temperature: temp }),
      topP: 0.9,
      setTopP: (value) => set({ topP: value }),
      
      // UI State
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        messages: state.messages,
        apiKey: state.apiKey,
        selectedModel: state.selectedModel,
        temperature: state.temperature,
        topP: state.topP,
      }),
    }
  )
);
