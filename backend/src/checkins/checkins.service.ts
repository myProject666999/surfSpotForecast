import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Checkin } from '../entities/checkin.entity';
import { SurfSpot } from '../entities/surf-spot.entity';
import { CreateCheckinDto } from './checkins.dto';

@Injectable()
export class CheckinsService {
  private readonly logger = new Logger(CheckinsService.name);

  constructor(
    @InjectRepository(Checkin)
    private readonly repo: Repository<Checkin>,
    @InjectRepository(SurfSpot)
    private readonly spotRepo: Repository<SurfSpot>,
  ) {}

  async getBySpot(spotId: number, limit = 50): Promise<Checkin[]> {
    this.logger.debug(`Fetching checkins for spot #${spotId}`);
    await this.checkSpotExists(spotId);
    return this.repo.find({
      where: { spot_id: spotId },
      order: { checkin_time: 'DESC' },
      take: limit,
    });
  }

  async create(dto: CreateCheckinDto): Promise<Checkin> {
    this.logger.debug(`Creating checkin for spot #${dto.spot_id} by ${dto.user_name}`);
    await this.checkSpotExists(dto.spot_id);
    const checkin = this.repo.create({
      ...dto,
      checkin_time: dto.checkin_time ? new Date(dto.checkin_time) : new Date(),
    });
    const saved = await this.repo.save(checkin);
    this.logger.debug(`Created checkin #${saved.id}`);
    return saved;
  }

  async findOne(id: number): Promise<Checkin> {
    const checkin = await this.repo.findOne({ where: { id } });
    if (!checkin) {
      throw new NotFoundException(`Checkin #${id} not found`);
    }
    return checkin;
  }

  async remove(id: number): Promise<void> {
    this.logger.debug(`Deleting checkin #${id}`);
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Checkin #${id} not found`);
    }
  }

  async getAllLatest(limit = 100): Promise<Checkin[]> {
    this.logger.debug(`Fetching latest ${limit} checkins`);
    return this.repo.find({
      order: { checkin_time: 'DESC' },
      take: limit,
      relations: { spot: true },
    });
  }

  private async checkSpotExists(spotId: number) {
    const spot = await this.spotRepo.findOne({ where: { id: spotId } });
    if (!spot) {
      throw new NotFoundException(`Surf spot #${spotId} not found`);
    }
  }
}
