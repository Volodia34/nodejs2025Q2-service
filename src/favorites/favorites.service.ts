import { Injectable, Inject, forwardRef } from '@nestjs/common';
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
}
