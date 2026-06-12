import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Forecast } from '../entities/forecast.entity';
import { SurfSpot } from '../entities/surf-spot.entity';
import { CreateForecastDto } from './forecasts.dto';

@Injectable()
export class ForecastsService {
  private readonly logger = new Logger(ForecastsService.name);

  constructor(
    @InjectRepository(Forecast)
    private readonly forecastRepo: Repository<Forecast>,
    @InjectRepository(SurfSpot)
    private readonly spotRepo: Repository<SurfSpot>,
  ) {}

  async getBySpot(spotId: number, startDate?: string, endDate?: string): Promise<Forecast[]> {
    this.logger.debug(`Fetching forecasts for spot #${spotId}`);
    await this.checkSpotExists(spotId);
    const where: any = { spot_id: spotId };
    if (startDate) where.forecast_time = MoreThanOrEqual(new Date(startDate));
    if (endDate) where.forecast_time = LessThanOrEqual(new Date(endDate));
    const forecasts = await this.forecastRepo.find({
      where,
      order: { forecast_time: 'ASC' },
    });
    this.logger.debug(`Found ${forecasts.length} forecasts for spot #${spotId}`);
    return forecasts;
  }

  async create(dto: CreateForecastDto): Promise<Forecast> {
    await this.checkSpotExists(dto.spot_id);
    const today = new Date().toISOString().split('T')[0];
    const forecast = this.forecastRepo.create({
      ...dto,
      forecast_time: new Date(dto.forecast_time),
      fetch_date: new Date(today),
    });
    return this.forecastRepo.save(forecast);
  }

  @Cron('0 0 6 * * *')
  async dailyFetchForecasts() {
    this.logger.log('Starting daily forecast data fetch simulation');
    await this.fetchAndGenerateMockData();
    this.logger.log('Daily forecast fetch completed');
  }

  async fetchAndGenerateMockData() {
    const spots = await this.spotRepo.find();
    this.logger.debug(`Generating mock forecasts for ${spots.length} spots`);

    for (const spot of spots) {
      await this.generateForSpot(spot.id);
    }
  }

  private async generateForSpot(spotId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const fetchDate = new Date(today);

    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour += 3) {
        const forecastTime = new Date(today);
        forecastTime.setDate(forecastTime.getDate() + day);
        forecastTime.setHours(hour, 0, 0, 0);

        const existing = await this.forecastRepo.findOne({
          where: { spot_id: spotId, forecast_time: forecastTime, fetch_date: fetchDate },
        });
        if (existing) continue;

        const baseHeight = 0.5 + Math.random() * 2.5;
        const dayFactor = Math.sin((hour / 24) * Math.PI * 2) * 0.3;
        const waveHeight = Math.round((baseHeight + dayFactor) * 100) / 100;

        const forecast = this.forecastRepo.create({
          spot_id: spotId,
          forecast_time: forecastTime,
          wave_height: waveHeight,
          wave_direction: Math.floor(Math.random() * 360),
          wind_speed: Math.round(Math.random() * 30 * 100) / 100,
          wind_direction: Math.floor(Math.random() * 360),
          tide_level: Math.round(Math.sin((hour / 12) * Math.PI) * 2 * 100) / 100,
          fetch_date: fetchDate,
        });
        await this.forecastRepo.save(forecast);
      }
    }
    this.logger.debug(`Generated 7-day forecasts for spot #${spotId}`);
  }

  async manualTriggerFetch(): Promise<{ message: string }> {
    this.logger.log('Manual forecast fetch triggered');
    await this.fetchAndGenerateMockData();
    return { message: 'Forecast data generated successfully' };
  }

  private async checkSpotExists(spotId: number) {
    const spot = await this.spotRepo.findOne({ where: { id: spotId } });
    if (!spot) {
      throw new NotFoundException(`Surf spot #${spotId} not found`);
    }
  }
}
