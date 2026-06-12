import { IsInt, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateSurfLogDto {
  @IsInt()
  spot_id: number;

  @IsString()
  user_name: string;

  @IsDateString()
  log_date: string;

  @IsOptional()
  @IsString()
  board_type?: string;

  @IsOptional()
  @IsString()
  board_length?: string;

  @IsOptional()
  @IsString()
  tricks?: string;

  @IsOptional()
  @IsString()
  video_url?: string;

  @IsOptional()
  @IsInt()
  duration?: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateSurfLogDto {
  @IsOptional()
  @IsString()
  board_type?: string;

  @IsOptional()
  @IsString()
  board_length?: string;

  @IsOptional()
  @IsString()
  tricks?: string;

  @IsOptional()
  @IsString()
  video_url?: string;

  @IsOptional()
  @IsInt()
  duration?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
