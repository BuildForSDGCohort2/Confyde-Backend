import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './../../shared/database/database.module';
import { Module } from '@nestjs/common';
import { PhysiciansController } from './physicians.controller';
import { PhysiciansService } from './physicians.service';
import { Physician, PhysicianProfile } from './../../shared/database';
import { PhysiciansProfileService } from './physicians-profile.service';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature(
      [
        Physician, PhysicianProfile
      ]
    )
  ],
  controllers: [PhysiciansController],
  providers: [PhysiciansService, PhysiciansProfileService]
})
export class PhysiciansModule {}
