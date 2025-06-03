import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';

@Module({
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
