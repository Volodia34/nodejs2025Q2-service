import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  VersionColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Transform } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column()
  @Exclude()
  password: string;

  @VersionColumn()
  version: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Transform(({ value }) => value.getTime())
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @Transform(({ value }) => value.getTime())
  updatedAt: Date;
}
