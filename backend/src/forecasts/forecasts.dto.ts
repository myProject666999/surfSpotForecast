import { IsInt, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateForecastDto {
  @IsInt()
  spot_id: number;

  @IsDateString()
  forecast_time: string;

  @IsNumber()
  wave_height: number;

  @IsOptional()
  @IsInt()
  wave_direction?: number;

  @IsOptional()
  @IsNumber()
  wind_speed?: number;

  @IsOptional()
  @IsInt()
  wind_direction?: number;

  @IsOptional()
  @IsNumber()
  tide_level?: number;
}
