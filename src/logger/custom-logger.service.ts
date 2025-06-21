import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { appendFile, stat, mkdir, rename } from 'fs/promises';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const LOG_LEVEL = process.env.LOG_LEVEL || 'debug';
const LOG_DIR = process.env.LOG_DIR || 'logs';
const MAX_FILE_SIZE_KB = parseInt(process.env.MAX_FILE_SIZE_KB) || 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_KB * 1024;

const LOG_LEVEL_MAP: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  log: 2,
  fatal: 2,
  debug: 3,
  verbose: 4,
};

@Injectable()
export class MyLogger implements LoggerService {
  private currentLogLevel: number = LOG_LEVEL_MAP[LOG_LEVEL] ?? 3;

  constructor() {
    this.ensureLogDirExists();
  }

  private async ensureLogDirExists() {
    try {
      await stat(LOG_DIR);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await mkdir(LOG_DIR, { recursive: true });
      }
    }
  }

  log(message: any, context?: string) {
    if (this.currentLogLevel >= LOG_LEVEL_MAP.log) {
      this.writeLog('log', message, context);
    }
  }

  fatal(message: any, context?: string) {
    if (this.currentLogLevel >= LOG_LEVEL_MAP.log) {
      this.writeLog('fatal', message, context);
    }
  }

  error(message: any, trace?: string, context?: string) {
    if (this.currentLogLevel >= LOG_LEVEL_MAP.error) {
      this.writeLog('error', message, context, trace);
    }
  }

  warn(message: any, context?: string) {
    if (this.currentLogLevel >= LOG_LEVEL_MAP.warn) {
      this.writeLog('warn', message, context);
    }
  }

  debug(message: any, context?: string) {
    if (this.currentLogLevel >= LOG_LEVEL_MAP.debug) {
      this.writeLog('debug', message, context);
    }
  }

  verbose(message: any, context?: string) {
    if (this.currentLogLevel >= LOG_LEVEL_MAP.verbose) {
      this.writeLog('verbose', message, context);
    }
  }

  private async writeLog(
    level: LogLevel,
    message: any,
    context?: string,
    trace?: string,
  ) {
    const logMessage = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${
      context ? '[' + context + '] ' : ''
    }${message} ${trace ? '\\n' + trace : ''}\n`;

    const logFile = join(LOG_DIR, `application.log`);
    const errorFile = join(LOG_DIR, `error.log`);

    process.stdout.write(logMessage);

    try {
      if (level === 'error' || level === 'fatal') {
        await this.rotateLogFile(errorFile);
        await appendFile(errorFile, logMessage);
      }
      await this.rotateLogFile(logFile);
      await appendFile(logFile, logMessage);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  private async rotateLogFile(filePath: string) {
    try {
      const stats = await stat(filePath);
      if (stats.size > MAX_FILE_SIZE_BYTES) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const newFileName = `${filePath.replace('.log', '')}_${timestamp}.log`;
        await rename(filePath, newFileName);
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        return;
      }
      console.error('Failed to rotate log file:', error);
    }
  }
}
