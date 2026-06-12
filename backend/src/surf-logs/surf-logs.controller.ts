import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { SurfLogsService } from './surf-logs.service';
import { SurfLog } from '../entities/surf-log.entity';
import { CreateSurfLogDto, UpdateSurfLogDto } from './surf-logs.dto';

@Controller('api/surf-logs')
export class SurfLogsController {
  constructor(private readonly service: SurfLogsService) {}

  @Get()
  findAll(
    @Query('userName') userName?: string,
    @Query('spotId') spotId?: string,
  ): Promise<SurfLog[]> {
    return this.service.findAll(userName, spotId ? parseInt(spotId, 10) : undefined);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SurfLog> {
    return this.service.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateSurfLogDto): Promise<SurfLog> {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSurfLogDto): Promise<SurfLog> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
