import { Injectable } from '@nestjs/common';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];
}
