# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## よく使用する開発コマンド

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm run start

# Lintチェック
npm run lint

# TypeScript型チェック
npx tsc --noEmit
```

## アーキテクチャ概要

これは、OpenRouter APIを使用して複数のAIモデル（GPT、Claude、Geminiなど）にアクセスする、Next.js 15.5ベースのモバイルファーストAIチャットアプリケーションです。

### コアアーキテクチャ

**フロントエンド**: Next.js App Router + TypeScript + Tailwind CSS + shadcn/uiコンポーネント
**状態管理**: Zustand + localStorage永続化（チャット履歴と設定）
**API統合**: ストリーミング対応とモデル動的取得機能付きOpenRouterクライアント

### 主要コンポーネント構造

**メインチャットインターフェース** (`components/chat/chat-interface.tsx`):
- すべてのチャット機能を処理する中心的なコンポーネント
- メッセージ送信、ストリーミング応答、画像アップロードを管理
- モデル選択とパラメータ制御と統合

**状態管理** (`store/chat-store.ts`):
- 永続化機能付きZustandストア
- メッセージ、API設定、モデル選択、LLMパラメータを管理
- localStorageに自動保存

**OpenRouter統合** (`lib/openrouter.ts`):
- OpenRouterとのAPI通信を処理
- ストリーミング応答とマルチモーダル入力（テキスト＋画像）をサポート
- 認証とエラーハンドリングを管理

**動的モデル管理** (`lib/models.ts`):
- OpenRouter APIから利用可能なモデルを取得・フィルタリング
- バランス型選択アルゴリズムでモデルをfree/premiumに分類
- プロバイダーベースフィルタリングでモデルリストを動的更新

### データフロー

1. **モデル読み込み**: アプリ開始時、`updateAvailableModels()`がOpenRouter APIから全利用可能モデルを取得
2. **モデルフィルタリング**: モデルをフィルタリング・バランス調整（プロバイダー毎最大8個）して多様性を確保
3. **メッセージ処理**: ユーザー入力を画像サポート付きOpenRouter形式に変換
4. **API通信**: free/paidモデルに応じた適切なデータポリシーでOpenRouterにリクエスト送信
5. **レスポンスストリーミング**: レスポンスをリアルタイムでストリーミング・段階的解析

### 重要な実装詳細

**フリーモデルデータポリシー**: フリーモデル（`:free`で終わる）は、OpenRouter要件に準拠するため自動的に`data_collection: 'deny'`、`training_data: 'deny'`、`output_publishing: 'deny'`を使用。

**モデル固有の処理**: 一部のモデル（`openai/gpt-oss-120b:free`など）は、API制約により特定の`max_tokens`パラメータが必要。

**画像処理**: 画像はbase64に変換され、アップロード時に自動的にビジョン対応モデルに切り替え。

**エラーハンドリング**: ユーザーフレンドリーなメッセージとデバッグ用詳細ログを含む包括的なエラー処理。

### 状態の永続化

アプリはZustandミドルウェアを使用して以下を永続化：
- チャットメッセージ履歴
- APIキーと設定
- モデル選択とパラメータ
- データ収集設定

すべてのデータはブラウザのlocalStorageにローカル保存（サーバーサイド保存なし）。

### モバイルファーストデザイン

- モバイルデバイス用に最適化されたレスポンシブデザイン
- manifest.json付きPWAサポート
- 適切なボタンサイズのタッチフレンドリーUI
- モバイルUX向けボトムナビゲーションパターン

### 開発メモ

- 厳密な型付けでTypeScriptを全体的に使用
- カスタムアニメーション・トランジション付きTailwind CSS
- shadcn/uiが一貫したUIコンポーネントを提供
- Framer Motionがアニメーション・トランジションを処理
- セキュリティのためすべてのAPIキーはクライアントサイドのみ保存