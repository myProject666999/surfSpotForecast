import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { SurfSpotsModule } from './surf-spots/surf-spots.module';
import { ForecastsModule } from './forecasts/forecasts.module';
import { CheckinsModule } from './checkins/checkins.module';
import { SurfLogsModule } from './surf-logs/surf-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST', 'localhost'),
        port: parseInt(config.get('DB_PORT', '3306'), 10),
        username: config.get('DB_USER', 'root'),
        password: config.get('DB_PASSWORD', '123456'),
        database: config.get('DB_DATABASE', 'surf_spot_forecast'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: true,
        charset: 'utf8mb4',
      }),
      inject: [ConfigService],
    }),
    SurfSpotsModule,
    ForecastsModule,
    CheckinsModule,
    SurfLogsModule,
  ],
})
export class AppModule {}
