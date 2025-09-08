# GitHub Push Instructions 🚀

## 1. GitHubでリポジトリを作成

1. [GitHub](https://github.com) にログイン
2. 右上の「+」ボタンから「New repository」を選択
3. 以下の設定でリポジトリを作成：
   - Repository name: `mobile-openrouter`
   - Description: `OpenRouter AI Chat Mobile App - A modern AI chat application with multiple model support`
   - Public または Private を選択
   - **重要**: 「Initialize this repository with:」のチェックは全て外す（README, .gitignore, license）
   - 「Create repository」をクリック

## 2. ローカルリポジトリをGitHubに接続

GitHubでリポジトリを作成したら、表示されるURLをコピーして以下のコマンドを実行：

```bash
# GitHubのリポジトリをremoteとして追加（your-usernameを実際のユーザー名に変更）
git remote add origin https://github.com/your-username/mobile-openrouter.git

# または、SSHを使用する場合
git remote add origin git@github.com:your-username/mobile-openrouter.git

# mainブランチにプッシュ
git push -u origin main
```

## 3. 追加の推奨設定

### GitHub Pagesの設定（オプション）
1. GitHubリポジトリの「Settings」タブへ
2. 「Pages」セクションへ
3. Source: Deploy from a branch
4. Branch: main / docs

### 環境変数の設定（Vercelデプロイ用）
1. Vercelにログイン
2. Import Git Repository
3. 環境変数に`NEXT_PUBLIC_OPENROUTER_API_KEY`を設定（オプション）

### GitHub Actionsの設定（CI/CD）
`.github/workflows/ci.yml`ファイルを作成：

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    - run: npm ci
    - run: npm run build
    - run: npx tsc --noEmit
```

## 4. 今後の更新

新しい変更をプッシュする場合：

```bash
# 変更をステージング
git add .

# コミット
git commit -m "feat: 新機能の説明"

# プッシュ
git push
```

## 5. タグとリリース

バージョンリリースの場合：

```bash
# タグを作成
git tag -a v1.0.0 -m "Version 1.0.0 - Initial release"

# タグをプッシュ
git push origin v1.0.0
```

## 6. 便利なGitコマンド

```bash
# 現在の状態を確認
git status

# 変更履歴を確認
git log --oneline

# リモートリポジトリを確認
git remote -v

# ブランチを確認
git branch -a
```

## 注意事項

⚠️ **重要**: 
- `.env.local`ファイルは絶対にコミットしない（.gitignoreに含まれています）
- APIキーは絶対にGitHubにプッシュしない
- センシティブな情報が含まれていないか、プッシュ前に必ず確認

## トラブルシューティング

### プッシュが拒否される場合
```bash
# 強制プッシュ（初回のみ、注意して使用）
git push -u origin main --force
```

### リモートURLを変更する場合
```bash
# 現在のURLを確認
git remote -v

# URLを変更
git remote set-url origin https://github.com/new-username/mobile-openrouter.git
```

---

準備ができたら、上記の手順に従ってGitHubにプッシュしてください！ 🎉
