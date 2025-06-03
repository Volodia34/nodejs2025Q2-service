import { Injectable } from '@nestjs/common';
import { Track } from './entities/track.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];

  create(createTrackDto: CreateTrackDto): Track {
    const newTrack: Track = {
      id: uuidv4(),
      name: createTrackDto.name,
      artistId:
        createTrackDto.artistId === undefined ? null : createTrackDto.artistId,
      albumId:
        createTrackDto.albumId === undefined ? null : createTrackDto.albumId,
      duration: createTrackDto.duration,
    };
    this.tracks.push(newTrack);
    return newTrack;
  }

  findAll(): Track[] {
    return this.tracks;
  }
}
