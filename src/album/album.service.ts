import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { TrackService } from '../track/track.service';

@Injectable()
export class AlbumService {
  private albums: Album[] = [];

  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  create(createAlbumDto: CreateAlbumDto): Album {
    const newAlbum: Album = {
      id: uuidv4(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId:
        createAlbumDto.artistId === undefined ? null : createAlbumDto.artistId,
    };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  findAll(): Album[] {
    return this.albums;
  }

  findOne(id: string): Album {
    const album = this.albums.find((a) => a.id === id);
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    const albumIndex = this.albums.findIndex((a) => a.id === id);
    if (albumIndex === -1) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    const existingAlbum = this.albums[albumIndex];
    const updatedAlbum = {
      ...existingAlbum,
      ...updateAlbumDto,
    };

    if (updateAlbumDto.hasOwnProperty('artistId')) {
      updatedAlbum.artistId = updateAlbumDto.artistId;
    }

    this.albums[albumIndex] = updatedAlbum;
    return updatedAlbum;
  }

  delete(id: string): void {
    const albumIndex = this.albums.findIndex((albumEl) => albumEl.id === id);
    if (albumIndex === -1) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    this.albums.splice(albumIndex, 1);

    this.trackService.removeAlbumFromTracks(id);
  }

  removeArtistFromAlbums(artistId: string): void {
    this.albums.forEach((album) => {
      if (album.artistId === artistId) {
        album.artistId = null;
      }
    });
  }
}
