import { Module } from '@nestjs/common';
import { MyLogger } from './custom-logger.service';

@Module({
  providers: [MyLogger],
  exports: [MyLogger],
})
export class LoggerModule {}
