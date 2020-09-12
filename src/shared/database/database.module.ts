import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        name: 'default',
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        charset: configService.get('database.charset'),
        entityPrefix: configService.get('database.prefix') || '',
        autoLoadEntities: true,
        logger: 'advanced-console',
        logging:
          configService.get('app.debug') === true
            ? 'all'
            : configService.get('app.debug'),
        legacySpatialSupport: configService.get(
          'database.legacySpatialSupport',
        ),
        synchronize: configService.get('database.synchronize'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
