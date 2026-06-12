import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { SurfSpotsService } from './surf-spots.service';
import { SurfSpot } from '../entities/surf-spot.entity';
import { CreateSurfSpotDto, UpdateSurfSpotDto } from './surf-spots.dto';

@Controller('api/surf-spots')
export class SurfSpotsController {
  constructor(private readonly service: SurfSpotsService) {}

  @Get()
  findAll(): Promise<SurfSpot[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SurfSpot> {
    return this.service.findOne(id);
  }

  @Get(':id/stats')
  getStats(@Param('id', ParseIntPipe) id: number) {
    return this.service.getStats(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateSurfSpotDto): Promise<SurfSpot> {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSurfSpotDto): Promise<SurfSpot> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
