import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        name: 'test',
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        charset: configService.get('database.charset'),
        entityPrefix: configService.get('database.prefix') || '',
        autoLoadEntities: true,
        legacySpatialSupport: configService.get(
          'database.legacySpatialSupport',
        ),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class TestDatabaseModule {}

/*

name: 'test',
type: 'sqlite',
database: `${process.cwd()}/data/e2e-tests.sqlite`,
autoLoadEntities: true,
*/
// entities: ['./**/*.entity.js'],
