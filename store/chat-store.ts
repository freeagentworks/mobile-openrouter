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
  
  // Privacy Settings
  dataCollection: 'allow' | 'deny';
  setDataCollection: (setting: 'allow' | 'deny') => void;
  trainingData: 'allow' | 'deny';
  setTrainingData: (setting: 'allow' | 'deny') => void;
  outputPublishing: 'allow' | 'deny';
  setOutputPublishing: (setting: 'allow' | 'deny') => void;
  
  // UI State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const DEFAULT_TEXT_MODEL = 'google/gemini-2.0-flash-exp:free';
const DEFAULT_IMAGE_MODEL = 'google/gemini-2.0-flash-exp:free';

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
      
      // Privacy Settings
      dataCollection: 'allow' as 'allow' | 'deny',
      setDataCollection: (setting) => set({ dataCollection: setting }),
      trainingData: 'allow' as 'allow' | 'deny',
      setTrainingData: (setting) => set({ trainingData: setting }),
      outputPublishing: 'allow' as 'allow' | 'deny',
      setOutputPublishing: (setting) => set({ outputPublishing: setting }),
      
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
        dataCollection: state.dataCollection,
        trainingData: state.trainingData,
        outputPublishing: state.outputPublishing,
      }),
    }
  )
);
