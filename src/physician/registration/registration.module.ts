import { PhysiciansService } from './../../admin/physicians/physicians.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './../../shared/database/database.module';
import { Module } from '@nestjs/common';
import { RegistrationController } from './registration.controller';
import { Physician, PhysicianProfile } from './../../shared/database';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([
      Physician,
      PhysicianProfile,
    ])
  ],
  controllers: [RegistrationController],
  providers: [PhysiciansService]
})
export class RegistrationModule {}
