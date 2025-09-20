import { App } from '@slack/bolt';
import { SlackMessage, BotContext, Command } from './types';
import { env } from './env';

// Slack Appの初期化
const app = new App({
  token: env.SLACK_BOT_TOKEN,
  signingSecret: env.SLACK_SIGNING_SECRET,
  socketMode: false, // Socket Modeは使用しない（Render.comでWebサーバーとして動作）
  port: env.PORT
});

// コマンドの定義
const commands: Command[] = [
  {
    matcher: (message: string): boolean => 
      message.includes('hello') || message.includes('こんにちは'),
    handler: async ({ message, say }: BotContext): Promise<void> => {
      await say(`こんにちは！<@${message.user}>さん、お疲れ様です！`);
    },
    description: '挨拶'
  },
  {
    matcher: (message: string): boolean => 
      message.includes('help') || message.includes('ヘルプ'),
    handler: async ({ say }: BotContext): Promise<void> => {
      await say({
        text: "利用可能なコマンド:",
        blocks: [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*利用可能なコマンド:*\n• `hello` または `こんにちは` - 挨拶\n• `help` または `ヘルプ` - このヘルプを表示\n• `status` または `ステータス` - システム状態を確認\n• `workload` または `ワークロード` - ワークロード情報を表示"
            }
          }
        ]
      });
    },
    description: 'ヘルプ表示'
  },
  {
    matcher: (message: string): boolean => 
      message.includes('status') || message.includes('ステータス'),
    handler: async ({ say }: BotContext): Promise<void> => {
      const timestamp = new Date().toLocaleString('ja-JP');
      await say(`✅ システムは正常に動作しています\n🕐 現在時刻: ${timestamp}`);
    },
    description: 'システム状態確認'
  },
  {
    matcher: (message: string): boolean => 
      message.includes('workload') || message.includes('ワークロード'),
    handler: async ({ say }: BotContext): Promise<void> => {
      await say("📊 ワークロード管理機能は準備中です。詳細な機能は今後追加予定です。");
    },
    description: 'ワークロード情報表示'
  }
];

// コマンドを実行する関数
const executeCommand = async (context: BotContext): Promise<boolean> => {
  const messageText = context.message.text.toLowerCase();
  
  for (const command of commands) {
    if (command.matcher(messageText)) {
      try {
        await command.handler(context);
        return true;
      } catch (error) {
        console.error(`コマンド実行エラー: ${command.description}`, error);
        await context.say('コマンドの実行中にエラーが発生しました。');
        return true;
      }
    }
  }
  
  return false;
};

// DMメッセージを受信した時の処理
app.message(async ({ message, say, client }) => {
  // メッセージがDMかどうかをチェック
  if (message.channel_type === 'im' && 'text' in message && 'user' in message) {
    console.log(`DM received from user ${message.user}: ${message.text}`);
    
    const context: BotContext = {
      message: message as SlackMessage,
      say,
      client,
      app
    };
    
    // コマンドを実行
    const commandExecuted = await executeCommand(context);
    
    // コマンドが実行されなかった場合のデフォルト応答
    if (!commandExecuted) {
      await say(`メッセージを受け取りました: "${message.text}"\n\n\`help\` と入力すると利用可能なコマンドを確認できます。`);
    }
  }
});

// エラーハンドリング
app.error(async (error) => {
  console.error('Slack App Error:', error);
});

// アプリの起動
const startApp = async (): Promise<void> => {
  try {
    await app.start();
    console.log('⚡️ Slack bot is running!');
  } catch (error) {
    console.error('Failed to start the app:', error);
    process.exit(1);
  }
};

// アプリを起動
startApp();

export default app;
