import { Album } from '../../album/entities/album.entity';
import { Artist } from '../../artist/entities/artist.entity';
import { Track } from '../../track/entities/track.entity';
import {
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('favorites')
export class Favorites {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Artist, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  artists: Artist[];

  @ManyToMany(() => Album, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  albums: Album[];

  @ManyToMany(() => Track, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  tracks: Track[];
}

export const InMemoryFavoritesStore: Favorites = {
  id: '',
  artists: [],
  albums: [],
  tracks: [],
};
