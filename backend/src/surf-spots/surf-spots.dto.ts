import { IsString, IsNumber, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { WaveType, SuitableLevel } from '../entities/surf-spot.entity';

export class CreateSurfSpotDto {
  @IsString()
  name: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsEnum(WaveType)
  wave_type: WaveType;

  @IsEnum(SuitableLevel)
  suitable_level: SuitableLevel;

  @IsOptional()
  @IsString()
  best_wind_direction?: string;

  @IsOptional()
  @IsString()
  best_tide?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateSurfSpotDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsEnum(WaveType)
  wave_type?: WaveType;

  @IsOptional()
  @IsEnum(SuitableLevel)
  suitable_level?: SuitableLevel;

  @IsOptional()
  @IsString()
  best_wind_direction?: string;

  @IsOptional()
  @IsString()
  best_tide?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
