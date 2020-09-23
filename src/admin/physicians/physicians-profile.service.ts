import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { PhysicianProfile } from './../../shared/database';

@Injectable()
export class PhysiciansProfileService extends TypeOrmCrudService<PhysicianProfile> {
  constructor(
    @InjectRepository(PhysicianProfile)
    private readonly repository: Repository<PhysicianProfile>,
  ) {
    super(repository);
  }
}
