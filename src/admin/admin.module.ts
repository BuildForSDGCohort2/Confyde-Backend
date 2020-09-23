import { Module } from '@nestjs/common';
import { AdminUsersModule } from './admin-users/admin-users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AuthModule } from './../auth/auth.module';
import { PhysiciansModule } from './physicians/physicians.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AdminUsersModule, RolesModule, PermissionsModule, AuthModule, PhysiciansModule, UsersModule],
  providers: [],
})
export class AdminModule {}
