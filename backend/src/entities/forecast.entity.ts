import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { SurfSpot } from './surf-spot.entity';

@Entity('forecasts')
@Index('uk_spot_time', ['spot_id', 'forecast_time', 'fetch_date'], { unique: true })
export class Forecast {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  spot_id: number;

  @Column({ type: 'datetime' })
  forecast_time: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  wave_height: number;

  @Column({ type: 'int', nullable: true })
  wave_direction: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  wind_speed: number;

  @Column({ type: 'int', nullable: true })
  wind_direction: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  tide_level: number;

  @Column({ type: 'date' })
  fetch_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => SurfSpot, (s) => s.forecasts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'spot_id' })
  spot: SurfSpot;
}
