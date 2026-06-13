import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurfLog } from '../entities/surf-log.entity';
import { SurfSpot } from '../entities/surf-spot.entity';
import { CreateSurfLogDto, UpdateSurfLogDto } from './surf-logs.dto';

@Injectable()
export class SurfLogsService {
  private readonly logger = new Logger(SurfLogsService.name);

  constructor(
    @InjectRepository(SurfLog)
    private readonly repo: Repository<SurfLog>,
    @InjectRepository(SurfSpot)
    private readonly spotRepo: Repository<SurfSpot>,
  ) {}

  async findAll(userName?: string, spotId?: number): Promise<SurfLog[]> {
    this.logger.debug('Fetching surf logs');
    const where: any = {};
    if (userName) where.user_name = userName;
    if (spotId) where.spot_id = spotId;
    return this.repo.find({
      where,
      order: { log_date: 'DESC' },
      relations: { spot: true },
    });
  }

  async findOne(id: number): Promise<SurfLog> {
    const log = await this.repo.findOne({ where: { id }, relations: { spot: true } });
    if (!log) {
      throw new NotFoundException(`Surf log #${id} not found`);
    }
    return log;
  }

  async create(dto: CreateSurfLogDto): Promise<SurfLog> {
    this.logger.debug(`Creating surf log for spot #${dto.spot_id} by ${dto.user_name}`);
    await this.checkSpotExists(dto.spot_id);
    const log = this.repo.create({
      ...dto,
      log_date: dto.log_date ? new Date(dto.log_date) : new Date(),
    });
    const saved = await this.repo.save(log);
    this.logger.debug(`Created surf log #${saved.id}`);
    return saved;
  }

  async update(id: number, dto: UpdateSurfLogDto): Promise<SurfLog> {
    this.logger.debug(`Updating surf log #${id}`);
    const log = await this.findOne(id);
    Object.assign(log, dto);
    return this.repo.save(log);
  }

  async remove(id: number): Promise<void> {
    this.logger.debug(`Deleting surf log #${id}`);
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Surf log #${id} not found`);
    }
  }

  private async checkSpotExists(spotId: number) {
    const spot = await this.spotRepo.findOne({ where: { id: spotId } });
    if (!spot) {
      throw new NotFoundException(`Surf spot #${spotId} not found`);
    }
  }
}
