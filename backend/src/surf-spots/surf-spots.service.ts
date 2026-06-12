import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurfSpot } from '../entities/surf-spot.entity';
import { CreateSurfSpotDto, UpdateSurfSpotDto } from './surf-spots.dto';

@Injectable()
export class SurfSpotsService {
  private readonly logger = new Logger(SurfSpotsService.name);

  constructor(
    @InjectRepository(SurfSpot)
    private readonly repo: Repository<SurfSpot>,
  ) {}

  async findAll(): Promise<SurfSpot[]> {
    this.logger.debug('Fetching all surf spots');
    const spots = await this.repo.find();
    this.logger.debug(`Found ${spots.length} surf spots`);
    return spots;
  }

  async findOne(id: number): Promise<SurfSpot> {
    this.logger.debug(`Fetching surf spot with id: ${id}`);
    const spot = await this.repo.findOne({ where: { id } });
    if (!spot) {
      throw new NotFoundException(`Surf spot #${id} not found`);
    }
    return spot;
  }

  async create(dto: CreateSurfSpotDto): Promise<SurfSpot> {
    this.logger.debug(`Creating new surf spot: ${dto.name}`);
    const spot = this.repo.create(dto);
    const saved = await this.repo.save(spot);
    this.logger.debug(`Created surf spot with id: ${saved.id}`);
    return saved;
  }

  async update(id: number, dto: UpdateSurfSpotDto): Promise<SurfSpot> {
    this.logger.debug(`Updating surf spot #${id}`);
    const spot = await this.findOne(id);
    Object.assign(spot, dto);
    return this.repo.save(spot);
  }

  async remove(id: number): Promise<void> {
    this.logger.debug(`Deleting surf spot #${id}`);
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Surf spot #${id} not found`);
    }
  }

  async getStats(id: number) {
    this.logger.debug(`Getting stats for surf spot #${id}`);
    await this.findOne(id);
    const [checkins, logs] = await Promise.all([
      this.repo.manager.query(
        'SELECT AVG(rating) as avg_rating, COUNT(*) as total_checkins FROM checkins WHERE spot_id = ?',
        [id],
      ),
      this.repo.manager.query(
        'SELECT COUNT(*) as total_logs FROM surf_logs WHERE spot_id = ?',
        [id],
      ),
    ]);
    return {
      avg_rating: checkins[0]?.avg_rating || 0,
      total_checkins: checkins[0]?.total_checkins || 0,
      total_logs: logs[0]?.total_logs || 0,
    };
  }
}
