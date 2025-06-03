import { Injectable } from '@nestjs/common';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumService {
  private albums: Album[] = [];
}
