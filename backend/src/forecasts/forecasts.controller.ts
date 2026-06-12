import { Controller, Get, Post, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ForecastsService } from './forecasts.service';
import { Forecast } from '../entities/forecast.entity';
import { CreateForecastDto } from './forecasts.dto';

@Controller('api/forecasts')
export class ForecastsController {
  constructor(private readonly service: ForecastsService) {}

  @Get('spot/:spotId')
  getBySpot(
    @Param('spotId', ParseIntPipe) spotId: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<Forecast[]> {
    return this.service.getBySpot(spotId, startDate, endDate);
  }

  @Post()
  create(@Body() dto: CreateForecastDto): Promise<Forecast> {
    return this.service.create(dto);
  }

  @Post('fetch')
  manualFetch(): Promise<{ message: string }> {
    return this.service.manualTriggerFetch();
  }
}
