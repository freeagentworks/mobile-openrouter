# OpenRouter AI Chat Mobile App 🤖💬

<div align="center">
  <img src="public/icon.svg" alt="OpenRouter AI Chat Logo" width="128" height="128">
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

## 📱 概要

OpenRouter AI Chat は、OpenRouter API を使用した最新のモバイルファーストなAIチャットアプリケーションです。GPT-5、Claude 4.1、Gemini 2.5 など、最新のAIモデルと会話できます。

### ✨ 主な特徴

- 🎯 **最新AIモデル対応** - GPT-5、Claude 4.1、Gemini 2.5シリーズなど
- 🆓 **無料モデル** - GPT-OSS、DeepSeek、Gemini Flash など7種類の無料モデル
- 💰 **有料モデル** - 動的に最新モデルを取得・表示
- 🖼️ **画像入力対応** - 画像をアップロードしてAIと対話（10MB以下）
- 📱 **モバイル最適化** - スマートフォンでの使いやすさを重視したUI/UX
- 🌓 **ダークモード対応** - 目に優しいダークテーマ
- 💾 **会話履歴保存** - ローカルストレージに自動保存
- 📤 **エクスポート機能** - 会話をMarkdown/JSON形式でダウンロード
- ⚡ **リアルタイムストリーミング** - レスポンスをリアルタイム表示
- 🔐 **セキュアな設計** - APIキーはローカルに保存、サーバー送信なし

## 🚀 クイックスタート

### 前提条件

- Node.js 18.0以上
- npm または yarn
- OpenRouter APIキー（[こちら](https://openrouter.ai/keys)から取得）

### インストール

1. **リポジトリをクローン**
```bash
git clone https://github.com/yourusername/mobile-openrouter.git
cd mobile-openrouter
```

2. **依存関係をインストール**
```bash
npm install
# または
yarn install
```

3. **環境変数を設定**（オプション）
```bash
cp .env.example .env.local
```

`.env.local` ファイルを編集してAPIキーを設定（アプリ内でも設定可能）：
```env
NEXT_PUBLIC_OPENROUTER_API_KEY=your_actual_api_key_here
```

4. **開発サーバーを起動**
```bash
npm run dev
# または
yarn dev
```

5. **ブラウザでアクセス**
```
http://localhost:3000
```

## 📋 利用可能なモデル

### 🆓 無料モデル

| モデル | プロバイダー | 特徴 | コンテキスト長 |
|--------|------------|------|--------------|
| GPT-OSS 120B | OpenAI | 高性能な汎用モデル | 128K |
| DeepSeek V3.1 | DeepSeek | コード生成に特化 | 128K |
| Gemini 2.0 Flash Exp | Google | 画像入力対応、高速 | 1M |
| Gemini 1.5 Flash | Google | 画像入力対応 | 1M |
| Mistral 7B | Mistral | 軽量で高速 | 32K |
| Llama 3.2 Vision | Meta | 画像入力対応 | 128K |
| Phi-3 Medium | Microsoft | 効率的な中型モデル | 128K |

### 💰 有料モデル（動的取得）

アプリ起動時に自動的に最新モデルを取得：

- **OpenAI**: GPT-5、GPT-5 Mini、GPT-5 Nano、GPT-4o Audio
- **Anthropic**: Claude Opus 4.1、Claude Sonnet 4
- **Google**: Gemini 2.5 Pro、Gemini 2.5 Flash、Gemini 2.5 Flash Lite
- **xAI**: Grok シリーズ
- その他多数の最新モデル

## 🛠️ 技術スタック

- **フレームワーク**: [Next.js 15.5](https://nextjs.org/) (App Router)
- **言語**: [TypeScript](https://www.typescriptlang.org/)
- **スタイリング**: [Tailwind CSS](https://tailwindcss.com/)
- **UIコンポーネント**: [shadcn/ui](https://ui.shadcn.com/)
- **状態管理**: [Zustand](https://zustand-demo.pmnd.rs/)
- **アニメーション**: [Framer Motion](https://www.framer.com/motion/)
- **アイコン**: [Lucide React](https://lucide.dev/)
- **ストレージ**: localStorage (ブラウザ)

## 📁 プロジェクト構造

```
mobile-openrouter/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # ホームページ（チャット）
│   ├── settings/          # 設定ページ
│   ├── guide/             # 使い方ガイド
│   └── metadata.ts        # メタデータ設定
├── components/            # Reactコンポーネント
│   ├── chat/             # チャット関連
│   │   └── chat-interface.tsx
│   ├── layout/           # レイアウト関連
│   │   └── bottom-nav.tsx
│   └── ui/               # shadcn/ui コンポーネント
├── lib/                   # ユーティリティ
│   ├── openrouter.ts     # OpenRouter API クライアント
│   ├── models.ts         # モデル管理・動的取得
│   └── utils.ts          # 汎用ユーティリティ
├── store/                 # 状態管理
│   └── chat-store.ts     # Zustandストア
├── public/               # 静的ファイル
│   ├── icon.svg          # アプリアイコン
│   ├── favicon.svg       # ファビコン
│   └── manifest.json     # PWA設定
└── docs/                 # ドキュメント
    └── setup-guide.md    # セットアップガイド
```

## 🔧 開発

### 利用可能なスクリプト

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm run start

# TypeScript型チェック
npx tsc --noEmit

# Lintチェック
npm run lint

# コードフォーマット（Prettierが必要）
npx prettier --write .
```

### 環境変数

| 変数名 | 説明 | 必須 | デフォルト |
|--------|------|------|----------|
| `NEXT_PUBLIC_OPENROUTER_API_KEY` | OpenRouter APIキー | ❌ | - |
| `NEXT_PUBLIC_DEFAULT_MODEL` | デフォルトモデル | ❌ | `google/gemini-2.0-flash-exp:free` |
| `NEXT_PUBLIC_DEFAULT_TEMPERATURE` | デフォルト温度 | ❌ | `0.7` |
| `NEXT_PUBLIC_DEFAULT_TOP_P` | デフォルトTop-P | ❌ | `0.9` |

※ APIキーはアプリ内の設定画面でも設定可能です

## 📱 PWA対応

このアプリはPWA（Progressive Web App）として動作します：

- ✅ ホーム画面に追加可能
- ✅ オフライン対応（基本UI）
- ✅ レスポンシブデザイン
- ⏳ プッシュ通知（今後実装予定）

### インストール方法

**iOS（Safari）**:
1. Safariでアプリを開く
2. 共有ボタンをタップ
3. 「ホーム画面に追加」を選択

**Android（Chrome）**:
1. Chromeでアプリを開く
2. メニューから「ホーム画面に追加」を選択
3. またはアドレスバーの「インストール」アイコンをタップ

## 🎮 使い方

### 基本的な使い方

1. **初期設定**
   - 設定画面（⚙️）でOpenRouter APIキーを入力
   - デフォルトのパラメータを調整（オプション）

2. **会話の開始**
   - チャット画面でメッセージを入力
   - Enterキーまたは送信ボタン（➤）で送信

3. **モデルの選択**
   - 画面上部のドロップダウンから使用するモデルを選択
   - 無料/有料モデルから選択可能

4. **画像の添付**
   - 📎ボタンから画像を選択（10MB以下）
   - 対応モデルが自動選択される

5. **会話の管理**
   - 🗑️ボタンから会話履歴を削除
   - 📥ボタンから会話をエクスポート

### パラメータ調整

- **Temperature** (0.0-1.0)
  - 低い値: より決定的で一貫性のある回答
  - 高い値: より創造的で多様な回答

- **Top-p** (0.0-1.0)
  - 低い値: より焦点を絞った回答
  - 高い値: より幅広い語彙を使用

## 🚢 デプロイ

### Vercel（推奨）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/mobile-openrouter)

1. 上記のボタンをクリック
2. リポジトリをインポート
3. 環境変数を設定（必要に応じて）
4. デプロイ

### 手動デプロイ

```bash
# ビルド
npm run build

# 静的エクスポート（静的ホスティング用）
npm run export

# サーバー起動（Node.js環境）
npm run start
```

## 🤝 コントリビューション

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

1. フォーク (`Fork`)
2. フィーチャーブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを開く

### 開発ガイドライン

- TypeScriptの型安全性を維持
- コンポーネントは関数型で記述
- Tailwind CSSのユーティリティクラスを使用
- コミットメッセージは[Conventional Commits](https://www.conventionalcommits.org/)に従う

## 🐛 既知の問題

- 一部の古いブラウザでストリーミングが正しく動作しない場合があります
- 大きな画像のアップロード時に処理時間がかかる場合があります

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 🙏 謝辞

- [OpenRouter](https://openrouter.ai/) - 統合AI API
- [Vercel](https://vercel.com/) - ホスティングプラットフォーム
- [shadcn/ui](https://ui.shadcn.com/) - UIコンポーネント
- すべてのコントリビューターとユーザーの皆様

## 📧 お問い合わせ

- **Issues**: [GitHub Issues](https://github.com/yourusername/mobile-openrouter/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/mobile-openrouter/discussions)
- **Email**: your-email@example.com

## 🔮 今後の予定

- [ ] 音声入力・出力機能
- [ ] プッシュ通知
- [ ] 会話のクラウド同期
- [ ] プラグインシステム
- [ ] 多言語対応（i18n）
- [ ] テーマカスタマイズ機能
- [ ] 会話テンプレート機能

---

<div align="center">
  Made with ❤️ using Next.js and OpenRouter API
  
  ⭐ Star this repo if you find it helpful!
</div>
