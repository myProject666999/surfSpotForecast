import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurfSpot } from '../entities/surf-spot.entity';
import { SurfSpotsController } from './surf-spots.controller';
import { SurfSpotsService } from './surf-spots.service';

@Module({
  imports: [TypeOrmModule.forFeature([SurfSpot])],
  controllers: [SurfSpotsController],
  providers: [SurfSpotsService],
  exports: [SurfSpotsService],
})
export class SurfSpotsModule {}
