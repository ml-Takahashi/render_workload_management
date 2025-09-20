import dotenv from 'dotenv';

// 環境変数を読み込み
dotenv.config();

// 環境変数の型定義
interface EnvConfig {
  SLACK_BOT_TOKEN: string;
  SLACK_SIGNING_SECRET: string;
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';
}

// 環境変数の検証
const validateEnv = (): EnvConfig => {
  const requiredEnvVars = ['SLACK_BOT_TOKEN', 'SLACK_SIGNING_SECRET'] as const;
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Required environment variable ${envVar} is not set`);
    }
  }
  
  return {
    SLACK_BOT_TOKEN: process.env['SLACK_BOT_TOKEN']!,
    SLACK_SIGNING_SECRET: process.env['SLACK_SIGNING_SECRET']!,
    PORT: process.env['PORT'] ? parseInt(process.env['PORT'], 10) : 3000,
    NODE_ENV: (process.env['NODE_ENV'] as EnvConfig['NODE_ENV']) || 'development'
  };
};

// 検証済みの環境変数をエクスポート
export const env = validateEnv();
