import { UsersService } from './../../admin/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './../../shared/database/database.module';
import { Module } from '@nestjs/common';
import { RegistrationController } from './registration.controller';
import { User, UserProfile } from './../../shared/database';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([
      User,
      UserProfile,
    ])
  ],
  controllers: [RegistrationController],
  providers: [UsersService]
})
export class RegistrationModule {}
