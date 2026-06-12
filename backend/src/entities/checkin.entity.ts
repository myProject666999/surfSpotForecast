import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SurfSpot } from './surf-spot.entity';

export enum CrowdLevel {
  EMPTY = 'empty',
  FEW = 'few',
  MODERATE = 'moderate',
  CROWDED = 'crowded',
  VERY_CROWDED = 'very_crowded',
}

@Entity('checkins')
export class Checkin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  spot_id: number;

  @Column({ type: 'varchar', length: 50 })
  user_name: string;

  @Column({ type: 'datetime' })
  checkin_time: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  actual_wave_height: number;

  @Column({ type: 'enum', enum: CrowdLevel, nullable: true })
  crowd_level: CrowdLevel;

  @Column({ type: 'tinyint' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => SurfSpot, (s) => s.checkins, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'spot_id' })
  spot: SurfSpot;
}
