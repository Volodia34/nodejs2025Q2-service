import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsOptional,
  IsUUID,
  Max,
} from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1000)
  @Max(new Date().getFullYear())
  year: number;

  @IsOptional()
  @IsUUID('4')
  artistId: string | null;
}
