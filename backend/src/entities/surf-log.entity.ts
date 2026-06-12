import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SurfSpot } from './surf-spot.entity';

@Entity('surf_logs')
export class SurfLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  spot_id: number;

  @Column({ type: 'varchar', length: 50 })
  user_name: string;

  @Column({ type: 'date' })
  log_date: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  board_type: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  board_length: string;

  @Column({ type: 'text', nullable: true })
  tricks: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  video_url: string;

  @Column({ type: 'int', nullable: true })
  duration: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => SurfSpot, (s) => s.logs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'spot_id' })
  spot: SurfSpot;
}
