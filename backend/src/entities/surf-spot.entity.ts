import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Forecast } from './forecast.entity';
import { Checkin } from './checkin.entity';
import { SurfLog } from './surf-log.entity';

export enum WaveType {
  POINT_BREAK = 'point_break',
  BEACH_BREAK = 'beach_break',
  REEF_BREAK = 'reef_break',
}

export enum SuitableLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

@Entity('surf_spots')
export class SurfSpot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @Column({ type: 'enum', enum: WaveType })
  wave_type: WaveType;

  @Column({ type: 'enum', enum: SuitableLevel })
  suitable_level: SuitableLevel;

  @Column({ type: 'varchar', length: 50, nullable: true })
  best_wind_direction: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  best_tide: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Forecast, (f) => f.spot)
  forecasts: Forecast[];

  @OneToMany(() => Checkin, (c) => c.spot)
  checkins: Checkin[];

  @OneToMany(() => SurfLog, (l) => l.spot)
  logs: SurfLog[];
}
