import { Controller, Get, Post, Delete, Body, Param, ParseIntPipe, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { CheckinsService } from './checkins.service';
import { Checkin } from '../entities/checkin.entity';
import { CreateCheckinDto } from './checkins.dto';

@Controller('api/checkins')
export class CheckinsController {
  constructor(private readonly service: CheckinsService) {}

  @Get()
  getAllLatest(@Query('limit') limit?: string): Promise<Checkin[]> {
    const limitNum = limit ? parseInt(limit, 10) : 100;
    return this.service.getAllLatest(limitNum);
  }

  @Get('spot/:spotId')
  getBySpot(
    @Param('spotId', ParseIntPipe) spotId: number,
    @Query('limit') limit?: string,
  ): Promise<Checkin[]> {
    const limitNum = limit ? parseInt(limit, 10) : 50;
    return this.service.getBySpot(spotId, limitNum);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Checkin> {
    return this.service.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCheckinDto): Promise<Checkin> {
    return this.service.create(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
