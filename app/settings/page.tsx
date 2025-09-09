'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
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
import { useChatStore } from '@/store/chat-store';
import { Key, Trash2, Download, ExternalLink, Save, Eye, EyeOff, Shield } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  const {
    apiKey,
    setApiKey,
    temperature,
    setTemperature,
    topP,
    setTopP,
    messages,
    clearMessages,
    dataCollection,
    setDataCollection,
    trainingData,
    setTrainingData,
    outputPublishing,
    setOutputPublishing,
  } = useChatStore();

  const [localApiKey, setLocalApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setLocalApiKey(apiKey);
  }, [apiKey]);

  const handleSaveApiKey = () => {
    setApiKey(localApiKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const exportChatAsMarkdown = () => {
    if (messages.length === 0) {
      alert('エクスポートする会話履歴がありません。');
      return;
    }

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

  const exportChatAsJSON = () => {
    if (messages.length === 0) {
      alert('エクスポートする会話履歴がありません。');
      return;
    }

    const json = JSON.stringify(messages, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto p-4 pb-20 md:pb-4">
        <h1 className="text-3xl font-bold mb-8">設定</h1>
        
        <div className="space-y-6">
          {/* API Key Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Key className="h-5 w-5" />
              APIキー設定
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="api-key">OpenRouter APIキー</Label>
                <div className="flex gap-2 mt-2">
                  <div className="relative flex-1">
                    <Input
                      id="api-key"
                      type={showApiKey ? 'text' : 'password'}
                      value={localApiKey}
                      onChange={(e) => setLocalApiKey(e.target.value)}
                      placeholder="sk-or-v1-..."
                      className="pr-10"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <Button onClick={handleSaveApiKey}>
                    <Save className="h-4 w-4 mr-2" />
                    保存
                  </Button>
                </div>
                {isSaved && (
                  <p className="text-sm text-green-600 mt-2">
                    APIキーが保存されました
                  </p>
                )}
              </div>
              
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  APIキーはローカルストレージに保存され、サーバーには送信されません。
                </p>
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  OpenRouterでAPIキーを取得
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </Card>

          {/* LLM Parameters */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">LLMパラメータ</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <span className="text-sm text-muted-foreground">{temperature.toFixed(1)}</span>
                </div>
                <Slider
                  id="temperature"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[temperature]}
                  onValueChange={([value]) => setTemperature(value)}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  回答の創造性を制御します。低い値は一貫性のある回答、高い値は創造的な回答を生成します。
                </p>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="top-p">Top-p</Label>
                  <span className="text-sm text-muted-foreground">{topP.toFixed(1)}</span>
                </div>
                <Slider
                  id="top-p"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[topP]}
                  onValueChange={([value]) => setTopP(value)}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  単語選択の多様性を制御します。累積確率の閾値を設定します。
                </p>
              </div>
            </div>
          </Card>

          {/* Privacy Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              プライバシー設定
            </h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  これらの設定は、OpenRouterへのAPIリクエストで送信されるデータポリシーを制御します。
                  無料モデルを使用する場合は、データ収集を許可する必要がある場合があります。
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="data-collection">データ収集を許可</Label>
                    <p className="text-sm text-muted-foreground">
                      あなたの入力データがモデル改善のために使用されることを許可します
                    </p>
                  </div>
                  <Switch
                    id="data-collection"
                    checked={dataCollection === 'allow'}
                    onCheckedChange={(checked) => 
                      setDataCollection(checked ? 'allow' : 'deny')
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="training-data">学習データとしての使用を許可</Label>
                    <p className="text-sm text-muted-foreground">
                      あなたの会話が将来のモデル学習に使用されることを許可します
                    </p>
                  </div>
                  <Switch
                    id="training-data"
                    checked={trainingData === 'allow'}
                    onCheckedChange={(checked) => 
                      setTrainingData(checked ? 'allow' : 'deny')
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="output-publishing">出力の公開を許可</Label>
                    <p className="text-sm text-muted-foreground">
                      AIの応答が研究目的などで公開されることを許可します
                    </p>
                  </div>
                  <Switch
                    id="output-publishing"
                    checked={outputPublishing === 'allow'}
                    onCheckedChange={(checked) => 
                      setOutputPublishing(checked ? 'allow' : 'deny')
                    }
                  />
                </div>
              </div>
              
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>注意:</strong> 無料モデル（:free付きモデル）を使用する場合、
                  データ収集を許可する必要がある場合があります。
                  プライバシーを重視する場合は、有料モデルを使用することをお勧めします。
                </p>
              </div>
            </div>
          </Card>

          {/* Data Management */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">データ管理</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-3">会話履歴のエクスポート</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={exportChatAsMarkdown} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Markdown形式でダウンロード
                  </Button>
                  <Button onClick={exportChatAsJSON} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    JSON形式でダウンロード
                  </Button>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-3">会話履歴の削除</h3>
                <Button
                  onClick={() => setShowClearDialog(true)}
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  すべての会話履歴を削除
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  現在の会話数: {messages.length}件
                </p>
              </div>
            </div>
          </Card>

          {/* About */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">このアプリについて</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>OpenRouter APIを使用したAIチャットアプリケーション</p>
              <p>Version: 1.0.0</p>
              <p>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  GitHub
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Clear Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>会話履歴を削除</AlertDialogTitle>
            <AlertDialogDescription>
              すべての会話履歴を削除します。この操作は取り消せません。
              続行しますか？
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
