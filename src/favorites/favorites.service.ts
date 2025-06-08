import {
  Injectable,
  Inject,
  forwardRef,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorites } from './entities/favorites.entity';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorites)
    private favoritesRepository: Repository<Favorites>,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  private async getFavorites(): Promise<Favorites> {
    const favorites = await this.favoritesRepository.find();
    if (favorites.length > 0) {
      return favorites[0];
    }
    const newFavorites = this.favoritesRepository.create({
      artists: [],
      albums: [],
      tracks: [],
    });
    return this.favoritesRepository.save(newFavorites);
  }

  async getAll() {
    return await this.getFavorites();
  }

  async addTrack(id: string) {
    let track;
    try {
      track = await this.trackService.findOne(id);
    } catch (error) {
      throw new UnprocessableEntityException(`Track with id ${id} not found`);
    }

    const favorites = await this.getFavorites();
    if (!favorites.tracks.find((t) => t.id === id)) {
      favorites.tracks.push(track);
      await this.favoritesRepository.save(favorites);
    }
    return { message: 'Track added to favorites' };
  }

  async addAlbum(id: string) {
    let album;
    try {
      album = await this.albumService.findOne(id);
    } catch (error) {
      throw new UnprocessableEntityException(`Album with id ${id} not found`);
    }

    const favorites = await this.getFavorites();
    if (!favorites.albums.find((a) => a.id === id)) {
      favorites.albums.push(album);
      await this.favoritesRepository.save(favorites);
    }
    return { message: 'Album added to favorites' };
  }

  async addArtist(id: string) {
    let artist;
    try {
      artist = await this.artistService.findOne(id);
    } catch (error) {
      throw new UnprocessableEntityException(`Artist with id ${id} not found`);
    }

    const favorites = await this.getFavorites();
    if (!favorites.artists.find((a) => a.id === id)) {
      favorites.artists.push(artist);
      await this.favoritesRepository.save(favorites);
    }
    return { message: 'Artist added to favorites' };
  }

  async removeTrack(id: string) {
    const favorites = await this.getFavorites();
    const trackIndex = favorites.tracks.findIndex((t) => t.id === id);
    if (trackIndex === -1) {
      throw new NotFoundException(`Track with id ${id} not in favorites`);
    }
    favorites.tracks.splice(trackIndex, 1);
    await this.favoritesRepository.save(favorites);
  }

  async removeAlbum(id: string) {
    const favorites = await this.getFavorites();
    const albumIndex = favorites.albums.findIndex((a) => a.id === id);
    if (albumIndex === -1) {
      throw new NotFoundException(`Album with id ${id} not in favorites`);
    }
    favorites.albums.splice(albumIndex, 1);
    await this.favoritesRepository.save(favorites);
  }

  async removeArtist(id: string) {
    const favorites = await this.getFavorites();
    const artistIndex = favorites.artists.findIndex((a) => a.id === id);
    if (artistIndex === -1) {
      throw new NotFoundException(`Artist with id ${id} not in favorites`);
    }
    favorites.artists.splice(artistIndex, 1);
    await this.favoritesRepository.save(favorites);
  }
}
