import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUsersService } from './admin-users.service';
import { Permission, Role, Admin, DatabaseModule } from '../../shared/database';
import { AdminUsersController } from './admin-users.controller';
import { RolesService } from '../roles/roles.service';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Admin, Role, Permission]),
  ],
  providers: [AdminUsersService, RolesService],
  controllers: [AdminUsersController],
})
export class AdminUsersModule {}
