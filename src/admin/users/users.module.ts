import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './../../shared/database/database.module';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserMedicalData, UserProfile } from './../../shared/database';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature(
      [
        User,
        UserProfile,
        UserMedicalData,
      ],
    )
  ],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
