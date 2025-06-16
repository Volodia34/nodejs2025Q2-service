import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MyLogger extends ConsoleLogger {
  private static LOGS_DIR = path.join(__dirname, '..', '..', 'logs');
  private static LOG_LEVELS: LogLevel[] = [
    'error',
    'warn',
    'log',
    'debug',
    'verbose',
  ];
  private maxFileSize: number;

  constructor() {
    super();
    const logLevel = parseInt(process.env.LOG_LEVEL, 10) || 3;
    this.setLogLevels(MyLogger.LOG_LEVELS.slice(0, logLevel + 1));
    this.maxFileSize =
      (parseInt(process.env.LOG_FILE_MAX_SIZE, 10) || 10) * 1024; // in bytes

    if (!fs.existsSync(MyLogger.LOGS_DIR)) {
      fs.mkdirSync(MyLogger.LOGS_DIR, { recursive: true });
    }
  }

  private getLogFilePath(type: 'error' | 'combined'): string {
    return path.join(MyLogger.LOGS_DIR, `${type}.log`);
  }

  private rotateLogFile(filePath: string) {
    try {
      if (
        fs.existsSync(filePath) &&
        fs.statSync(filePath).size > this.maxFileSize
      ) {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const newPath = filePath.replace('.log', `-${timestamp}.log`);
        fs.renameSync(filePath, newPath);
      }
    } catch (err) {
      console.error('Failed to rotate log file:', err);
    }
  }

  private writeToFile(filePath: string, message: string) {
    this.rotateLogFile(filePath);
    try {
      fs.appendFileSync(filePath, message + '\n', 'utf8');
    } catch (err) {
      console.error('Failed to write to log file:', err);
    }
  }

  log(message: any, context?: string) {
    if (!this.isLevelEnabled('log')) return;
    super.log(message, context);
    this.writeToFile(
      this.getLogFilePath('combined'),
      `[LOG] [${context || ''}] ${message}`,
    );
  }

  error(message: any, stack?: string, context?: string) {
    if (!this.isLevelEnabled('error')) return;
    super.error(message, stack, context);
    const errorMessage = `[ERROR] [${context || ''}] ${message}\nStack: ${stack || 'No stack'}`;
    this.writeToFile(this.getLogFilePath('combined'), errorMessage);
    this.writeToFile(this.getLogFilePath('error'), errorMessage);
  }

  warn(message: any, context?: string) {
    if (!this.isLevelEnabled('warn')) return;
    super.warn(message, context);
    this.writeToFile(
      this.getLogFilePath('combined'),
      `[WARN] [${context || ''}] ${message}`,
    );
  }

  debug(message: any, context?: string) {
    if (!this.isLevelEnabled('debug')) return;
    super.debug(message, context);
    this.writeToFile(
      this.getLogFilePath('combined'),
      `[DEBUG] [${context || ''}] ${message}`,
    );
  }

  verbose(message: any, context?: string) {
    if (!this.isLevelEnabled('verbose')) return;
    super.verbose(message, context);
    this.writeToFile(
      this.getLogFilePath('combined'),
      `[VERBOSE] [${context || ''}] ${message}`,
    );
  }
}
