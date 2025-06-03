import { Injectable } from '@nestjs/common';
import { Track } from './entities/track.entity';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];
}
