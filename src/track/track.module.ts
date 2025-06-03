import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { AppController } from '../app.controller';

@Module({
  controllers: [AppController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
