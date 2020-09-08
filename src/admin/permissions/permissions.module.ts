import { Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { DatabaseModule } from '../../shared/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permissions } from '../../shared/database';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Permissions]),
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule {}
