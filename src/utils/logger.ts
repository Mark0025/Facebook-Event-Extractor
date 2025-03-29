export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export class Logger {
  private static instance: Logger;
  private isDebugEnabled: boolean = true;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    const dataStr = data ? `\nData: ${JSON.stringify(data, null, 2)}` : '';
    return `${prefix} ${message}${dataStr}`;
  }

  debug(message: string, data?: any): void {
    if (this.isDebugEnabled) {
      console.debug(this.formatMessage('debug', message, data));
    }
  }

  info(message: string, data?: any): void {
    console.info(this.formatMessage('info', message, data));
  }

  warn(message: string, data?: any): void {
    console.warn(this.formatMessage('warn', message, data));
  }

  error(message: string, error?: Error | any): void {
    const errorData = error ? {
      message: error.message,
      stack: error.stack,
      ...error
    } : undefined;
    console.error(this.formatMessage('error', message, errorData));
  }

  setDebugEnabled(enabled: boolean): void {
    this.isDebugEnabled = enabled;
  }
} 