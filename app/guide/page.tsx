'use client';

import { Card } from '@/components/ui/card';
import { ExternalLink, Key, MessageSquare, Image as ImageIcon, Settings, Download, Trash2 } from 'lucide-react';

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto p-4 pb-20 md:pb-4">
        <h1 className="text-3xl font-bold mb-8">使い方ガイド</h1>
        
        <div className="space-y-6">
          {/* Getting Started */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Key className="h-5 w-5" />
              はじめに - APIキーの設定
            </h2>
            <ol className="space-y-3 list-decimal list-inside">
              <li>
                <a 
                  href="https://openrouter.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  OpenRouter
                  <ExternalLink className="h-3 w-3" />
                </a>
                にアクセスしてアカウントを作成
              </li>
              <li>ダッシュボードからAPIキーを取得</li>
              <li>設定画面でAPIキーを入力して保存</li>
              <li>これでAIとの会話を開始できます！</li>
            </ol>
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                💡 APIキーはお使いのデバイスにのみ保存され、サーバーには送信されません。
              </p>
            </div>
          </Card>

          {/* Basic Usage */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              基本的な使い方
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">テキストチャット</h3>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  <li>メッセージ入力欄にテキストを入力</li>
                  <li>Enterキーまたは送信ボタンでメッセージを送信</li>
                  <li>Shift + Enterで改行</li>
                  <li>AIの返答はリアルタイムでストリーミング表示されます</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  画像を使った会話
                </h3>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  <li>📎ボタンをクリックして画像を選択</li>
                  <li>画像は10MB以下のファイルに対応</li>
                  <li>画像添付時は自動的に画像対応モデルに切り替わります</li>
                  <li>画像について質問したり、分析を依頼できます</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Model Selection */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">モデルの選択</h2>
            <div className="space-y-3">
              <p className="text-muted-foreground">
                画面上部のドロップダウンメニューから使用するAIモデルを選択できます。
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="p-3 bg-muted rounded-lg">
                  <h3 className="font-medium mb-1">無料モデル</h3>
                  <p className="text-sm text-muted-foreground">
                    制限はありますが、無料で利用可能なモデル
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h3 className="font-medium mb-1">有料モデル</h3>
                  <p className="text-sm text-muted-foreground">
                    高性能で大容量のコンテキストに対応
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                📷マークがついているモデルは画像入力に対応しています。
              </p>
            </div>
          </Card>

          {/* Advanced Features */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              高度な機能
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">パラメータ調整</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <strong>Temperature:</strong> 創造性の度合いを調整（0.0〜1.0）
                    <br />
                    <span className="text-sm">低い値: より確実で一貫性のある回答</span>
                    <br />
                    <span className="text-sm">高い値: より創造的で多様な回答</span>
                  </li>
                  <li>
                    <strong>Top-p:</strong> 単語選択の多様性を制御（0.0〜1.0）
                    <br />
                    <span className="text-sm">トークン選択時の累積確率の閾値</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Data Management */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">データ管理</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Download className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium mb-1">会話のエクスポート</h3>
                  <p className="text-sm text-muted-foreground">
                    会話履歴をMarkdown形式でダウンロードできます
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Trash2 className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium mb-1">履歴の削除</h3>
                  <p className="text-sm text-muted-foreground">
                    すべての会話履歴を削除できます（復元不可）
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                🔒 すべてのデータはローカルに保存され、プライバシーが保護されています。
              </p>
            </div>
          </Card>

          {/* Tips */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">💡 Tips</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• 長い会話は定期的にエクスポートして保存することをお勧めします</li>
              <li>• モデルによってコンテキスト長（記憶できる会話の長さ）が異なります</li>
              <li>• 画像分析には専用のモデルが自動選択されます</li>
              <li>• APIの利用料金はOpenRouterダッシュボードで確認できます</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
