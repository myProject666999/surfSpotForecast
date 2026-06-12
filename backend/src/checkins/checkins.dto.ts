import { IsInt, IsString, IsDateString, IsNumber, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { CrowdLevel } from '../entities/checkin.entity';

export class CreateCheckinDto {
  @IsInt()
  spot_id: number;

  @IsString()
  user_name: string;

  @IsDateString()
  checkin_time: string;

  @IsOptional()
  @IsNumber()
  actual_wave_height?: number;

  @IsOptional()
  @IsEnum(CrowdLevel)
  crowd_level?: CrowdLevel;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
