import { App, SayFn } from '@slack/bolt';

export interface SlackMessage {
  text: string;
  user: string;
  channel: string;
  channel_type: 'im' | 'mpim' | 'channel' | 'group';
  ts: string;
  team?: string;
}

export interface BotContext {
  message: SlackMessage;
  say: SayFn;
  client: any;
  app: App;
}

export interface CommandHandler {
  (context: BotContext): Promise<void>;
}

export interface CommandMatcher {
  (message: string): boolean;
}

export interface Command {
  matcher: CommandMatcher;
  handler: CommandHandler;
  description: string;
}
