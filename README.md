# Render Workload Management Slack Bot

Slack DMでメッセージを受信して処理を実行するSlack botアプリケーションです。TypeScriptで実装されています。

## 機能

- DMメッセージの受信と応答
- コマンドベースの処理（hello, help, status, workload）
- Render.comでのデプロイ対応

## セットアップ

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. 環境変数の設定

`env.example`をコピーして`.env`ファイルを作成し、必要な値を設定してください：

```bash
cp env.example .env
```

`.env`ファイルに以下の値を設定：

```
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_SIGNING_SECRET=your-signing-secret-here
PORT=3000
```

### 3. Slack Appの設定

1. [Slack API](https://api.slack.com/apps)にアクセス
2. "Create New App"をクリック
3. "From scratch"を選択し、アプリ名とワークスペースを設定
4. 以下の設定を行う：

#### Bot Token Scopes
- `app_mentions:read`
- `channels:history`
- `chat:write`
- `im:history`
- `im:read`
- `im:write`

#### Event Subscriptions
- Enable Events: ON
- Request URL: `https://your-render-app-url.onrender.com/slack/events`
- Subscribe to bot events:
  - `message.im`

#### OAuth & Permissions
- Bot User OAuth Tokenをコピーして`SLACK_BOT_TOKEN`に設定

#### Basic Information
- Signing Secretをコピーして`SLACK_SIGNING_SECRET`に設定

### 4. ローカルでの実行

```bash
# 開発モード（TypeScript直接実行）
pnpm dev

# 開発モード（自動再起動）
pnpm dev:watch

# TypeScriptビルド
pnpm build

# 本番モード（ビルド後実行）
pnpm start
```

## Render.comでのデプロイ

### 1. GitHubリポジトリの作成

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/render_workload_management.git
git push -u origin main
```

### 2. Render.comでの設定

1. [Render.com](https://render.com)にログイン
2. "New +" → "Web Service"を選択
3. GitHubリポジトリを接続
4. 以下の設定を行う：
   - **Name**: `render-workload-management`
   - **Environment**: `Node`
   - **Build Command**: `pnpm install`
   - **Start Command**: `pnpm start`
   - **Plan**: Free

### 3. 環境変数の設定

Render.comのダッシュボードで以下の環境変数を設定：

- `SLACK_BOT_TOKEN`: あなたのSlack Bot Token
- `SLACK_SIGNING_SECRET`: あなたのSlack Signing Secret
- `NODE_ENV`: `production`

### 4. デプロイ

設定完了後、自動的にデプロイが開始されます。デプロイが完了したら、Slack Appの設定でRequest URLを更新してください。

## 利用可能なコマンド

DMで以下のコマンドが利用できます：

- `hello` または `こんにちは` - 挨拶
- `help` または `ヘルプ` - ヘルプを表示
- `status` または `ステータス` - システム状態を確認
- `workload` または `ワークロード` - ワークロード情報を表示

## カスタマイズ

`src/app.ts`ファイルを編集して、独自の処理を追加できます。現在の実装では、DMメッセージの内容に応じて異なる応答を返す仕組みになっています。

### TypeScriptの型安全性

このプロジェクトはTypeScriptで実装されており、以下の型定義が提供されています：

- `SlackMessage`: Slackメッセージの型定義
- `BotContext`: Botのコンテキスト情報
- `Command`: コマンドの型定義
- `EnvConfig`: 環境変数の型定義

### 新しいコマンドの追加

`src/app.ts`の`commands`配列に新しいコマンドを追加できます：

```typescript
{
  matcher: (message: string): boolean => message.includes('your-command'),
  handler: async ({ message, say }: BotContext): Promise<void> => {
    await say('Your response here');
  },
  description: 'Your command description'
}
```

## セキュリティ

### 機密情報の管理

このプロジェクトでは以下のセキュリティ対策を実装しています：

1. **環境変数の分離**
   - 実際の機密情報は`.env`ファイルに保存
   - `.env`ファイルは`.gitignore`でGitから除外
   - `env.example`にはプレースホルダー値のみ記載

2. **セキュリティチェック**
   ```bash
   # 機密情報の漏洩チェック（TypeScript版）
   pnpm run security-check
   ```

3. **推奨事項**
   - 実際のトークンは絶対にコードに直接記述しない
   - `.env`ファイルを他の人と共有しない
   - 定期的にセキュリティチェックを実行

### 環境変数の設定例

```bash
# .env ファイル（Gitにコミットしない）
SLACK_BOT_TOKEN=xoxb-xxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SLACK_SIGNING_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PORT=3000
```

## トラブルシューティング

### よくある問題

1. **Botが応答しない**
   - Slack Appの設定でEvent Subscriptionsが正しく設定されているか確認
   - Request URLが正しいか確認
   - 環境変数が正しく設定されているか確認

2. **デプロイエラー**
   - `render.yaml`の設定を確認
   - 環境変数がRender.comで正しく設定されているか確認

3. **権限エラー**
   - Bot Token Scopesに必要な権限が含まれているか確認

## ライセンス

ISC
