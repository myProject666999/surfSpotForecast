import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurfLog } from '../entities/surf-log.entity';
import { SurfSpot } from '../entities/surf-spot.entity';
import { SurfLogsController } from './surf-logs.controller';
import { SurfLogsService } from './surf-logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([SurfLog, SurfSpot])],
  controllers: [SurfLogsController],
  providers: [SurfLogsService],
  exports: [SurfLogsService],
})
export class SurfLogsModule {}
