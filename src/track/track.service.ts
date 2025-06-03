import { Injectable, NotFoundException } from '@nestjs/common';
import { Track } from './entities/track.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';


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

  findOne(id: string): Track {
    const track = this.tracks.find((t) => t.id === id);
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    const trackIndex = this.tracks.findIndex((t) => t.id === id);
    if (trackIndex === -1) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    const existingTrack = this.tracks[trackIndex];
    const updatedTrack = {
      ...existingTrack,
      ...updateTrackDto,
    };

    if (updateTrackDto.hasOwnProperty('artistId')) {
      updatedTrack.artistId = updateTrackDto.artistId;
    }
    if (updateTrackDto.hasOwnProperty('albumId')) {
      updatedTrack.albumId = updateTrackDto.albumId;
    }

    this.tracks[trackIndex] = updatedTrack;
    return updatedTrack;
  }
}
