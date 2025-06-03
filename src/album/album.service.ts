import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';

@Injectable()
export class AlbumService {
  private albums: Album[] = [];

  create(createAlbumDto: CreateAlbumDto): Album {
    const newAlbum: Album = {
      id: uuidv4(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId === undefined ? null : createAlbumDto.artistId,
    };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  findAll(): Album[] {
    return this.albums;
  }


}
