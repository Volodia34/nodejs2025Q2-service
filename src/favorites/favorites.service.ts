import {
  Injectable,
  Inject,
  forwardRef,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import { InMemoryFavoritesStore, Favorites } from './entities/favorites.entity';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { Artist } from '../artist/entities/artist.entity';
import { FavoritesResponseDto } from './dto/favorites-response.dto';
import { Album } from '../album/entities/album.entity';
import { Track } from '../track/entities/track.entity';

@Injectable()
export class FavoritesService {
  private favorites: Favorites = InMemoryFavoritesStore;

  constructor(
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  async getAll(): Promise<FavoritesResponseDto> {
    const artists: Artist[] = [];
    for (const artistId of this.favorites.artists) {
      try {
        const artist = this.artistService.findOne(artistId);
        artists.push(artist);
      } catch (error) {}
    }

    const albums: Album[] = [];
    for (const albumId of this.favorites.albums) {
      try {
        const album = this.albumService.findOne(albumId);
        albums.push(album);
      } catch (error) {}
    }

    const tracks: Track[] = [];
    for (const trackId of this.favorites.tracks) {
      try {
        const track = this.trackService.findOne(trackId);
        tracks.push(track);
      } catch (error) {}
    }

    return { artists, albums, tracks };
  }

  addTrack(id: string): { message: string } {
    try {
      this.trackService.findOne(id);
      if (!this.favorites.tracks.includes(id)) {
        this.favorites.tracks.push(id);
      }
      return { message: `Track with id ${id} successfully added to favorites` };
    } catch (error) {
      throw new UnprocessableEntityException(`Track with id ${id} not found`);
    }
  }

  addAlbum(id: string): { message: string } {
    try {
      this.albumService.findOne(id);
      if (!this.favorites.albums.includes(id)) {
        this.favorites.albums.push(id);
      }
      return { message: `Album with id ${id} successfully added to favorites` };
    } catch (error) {
      throw new UnprocessableEntityException(`Album with id ${id} not found`);
    }
  }

  addArtist(id: string): { message: string } {
    try {
      this.artistService.findOne(id);
      if (!this.favorites.artists.includes(id)) {
        this.favorites.artists.push(id);
      }
      return {
        message: `Artist with id ${id} successfully added to favorites`,
      };
    } catch (error) {
      throw new UnprocessableEntityException(`Artist with id ${id} not found`);
    }
  }

  removeTrack(id: string): void {
    const index = this.favorites.tracks.indexOf(id);
    if (index === -1) {
      throw new NotFoundException(`Track with id ${id} not found in favorites`);
    }
    this.favorites.tracks.splice(index, 1);
  }

  removeAlbum(id: string): void {
    const index = this.favorites.albums.indexOf(id);
    if (index === -1) {
      throw new NotFoundException(`Album with id ${id} not found in favorites`);
    }
    this.favorites.albums.splice(index, 1);
  }

  removeArtist(id: string): void {
    const index = this.favorites.artists.indexOf(id);
    if (index === -1) {
      throw new NotFoundException(
        `Artist with id ${id} not found in favorites`,
      );
    }
    this.favorites.artists.splice(index, 1);
  }
}
