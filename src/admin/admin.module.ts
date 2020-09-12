import { Module } from '@nestjs/common';
import { AdminUsersModule } from './admin-users/admin-users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AuthModule } from './../auth/auth.module';

@Module({
  imports: [AdminUsersModule, RolesModule, PermissionsModule, AuthModule],
  providers: [],
})
export class AdminModule {}
