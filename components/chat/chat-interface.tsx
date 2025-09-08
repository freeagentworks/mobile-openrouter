'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Trash2, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useChatStore, Message } from '@/store/chat-store';
import { AVAILABLE_MODELS, getDefaultModelForImage, updateAvailableModels, FREE_MODELS, PREMIUM_MODELS } from '@/lib/models';
import {
  sendOpenRouterRequest,
  streamOpenRouterResponse,
  convertMessagesToOpenRouterFormat,
  convertImageToBase64,
} from '@/lib/openrouter';
import { cn } from '@/lib/utils';

export function ChatInterface() {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('');
  const [availableModels, setAvailableModels] = useState(AVAILABLE_MODELS);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    messages,
    addMessage,
    clearMessages,
    apiKey,
    selectedModel,
    setSelectedModel,
    temperature,
    topP,
    isLoading,
    setIsLoading,
  } = useChatStore();

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStreamingMessage]);

  // Load premium models from OpenRouter API on mount
  useEffect(() => {
    const loadModels = async () => {
      setIsLoadingModels(true);
      try {
        await updateAvailableModels(apiKey);
        // Update local state with the new models
        setAvailableModels([...FREE_MODELS, ...PREMIUM_MODELS]);
      } catch (error) {
        console.error('Failed to load models:', error);
      } finally {
        setIsLoadingModels(false);
      }
    };
    
    loadModels();
  }, [apiKey]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('画像サイズは10MB以下にしてください。');
        return;
      }

      setSelectedImage(file);
      const base64 = await convertImageToBase64(file);
      setImagePreview(base64);

      // Switch to image-capable model if current model doesn't support images
      const currentModel = availableModels.find(m => m.id === selectedModel);
      if (!currentModel?.supportsImages) {
        setSelectedModel(getDefaultModelForImage());
      }
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    if (!apiKey) {
      alert('APIキーが設定されていません。設定画面からAPIキーを入力してください。');
      return;
    }

    const userMessage = {
      role: 'user' as const,
      content: input.trim() || '画像を送信しました',
      imageUrl: imagePreview || undefined,
    };

    addMessage(userMessage);
    setInput('');
    setSelectedImage(null);
    setImagePreview(null);
    setIsLoading(true);
    setCurrentStreamingMessage('');

    try {
      // Create a temporary Message object with id and timestamp for API call
      const tempUserMessage: Message = {
        ...userMessage,
        id: `temp-${Date.now()}`,
        timestamp: new Date(),
      };
      const openRouterMessages = convertMessagesToOpenRouterFormat([...messages, tempUserMessage], true);
      const response = await sendOpenRouterRequest({
        apiKey,
        model: selectedModel,
        messages: openRouterMessages,
        temperature,
        top_p: topP,
        stream: true,
      });

      let fullResponse = '';
      for await (const chunk of streamOpenRouterResponse(response)) {
        fullResponse += chunk;
        setCurrentStreamingMessage(fullResponse);
      }

      addMessage({
        role: 'assistant',
        content: fullResponse,
        model: selectedModel,
      });
      setCurrentStreamingMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage({
        role: 'assistant',
        content: `エラーが発生しました: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const exportChatAsMarkdown = () => {
    const markdown = messages
      .map(m => `### ${m.role === 'user' ? 'User' : 'Assistant'}\n\n${m.content}\n`)
      .join('\n---\n\n');
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-14 px-4">
          <h1 className="text-lg font-semibold">AI Chat</h1>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs" disabled={isLoadingModels}>
                  {isLoadingModels ? 'Loading...' : (availableModels.find(m => m.id === selectedModel)?.name || 'Select Model')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Free Models</DropdownMenuLabel>
                {availableModels.filter(m => m.isFree).map(model => (
                  <DropdownMenuItem
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className="flex flex-col items-start"
                  >
                    <span className="font-medium">{model.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {model.supportsImages ? '📷 ' : ''}
                      Context: {model.contextLength.toLocaleString()}
                    </span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Premium Models</DropdownMenuLabel>
                {availableModels.filter(m => !m.isFree).map(model => (
                  <DropdownMenuItem
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className="flex flex-col items-start"
                  >
                    <span className="font-medium">{model.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {model.supportsImages ? '📷 ' : ''}
                      Context: {model.contextLength.toLocaleString()}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowClearDialog(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All Messages
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportChatAsMarkdown}>
                  <Download className="mr-2 h-4 w-4" />
                  Export as Markdown
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="container max-w-4xl mx-auto p-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'mb-4 flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <Card
                  className={cn(
                    'max-w-[85%] md:max-w-[70%] p-3',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {message.imageUrl && (
                    <img
                      src={message.imageUrl}
                      alt="Uploaded"
                      className="mb-2 rounded-md max-w-full h-auto"
                    />
                  )}
                  <div className="whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                  {message.model && (
                    <div className="text-xs opacity-60 mt-2">
                      {availableModels.find(m => m.id === message.model)?.name || message.model}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
            
            {currentStreamingMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex justify-start"
              >
                <Card className="max-w-[85%] md:max-w-[70%] p-3 bg-muted">
                  <div className="whitespace-pre-wrap break-words">
                    {currentStreamingMessage}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          
          {messages.length === 0 && !currentStreamingMessage && (
            <div className="text-center text-muted-foreground mt-8">
              <p>AIアシスタントとの会話を開始してください</p>
              <p className="text-sm mt-2">メッセージを入力するか、画像を添付して送信</p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-background border-t">
        <div className="container max-w-4xl mx-auto p-4">
          {imagePreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-2"
            >
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-20 rounded-md"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                >
                  ×
                </Button>
              </div>
            </motion.div>
          )}
          
          <div className="flex gap-2 items-end">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="メッセージを入力..."
              className="min-h-[60px] max-h-[200px] resize-none"
              disabled={isLoading}
            />
            
            <Button
              size="icon"
              onClick={handleSend}
              disabled={(!input.trim() && !selectedImage) || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Clear Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>会話履歴を削除</AlertDialogTitle>
            <AlertDialogDescription>
              すべての会話履歴を削除します。この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                clearMessages();
                setShowClearDialog(false);
              }}
            >
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
