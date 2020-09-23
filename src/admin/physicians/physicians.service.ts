import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Physician } from './../../shared/database';

@Injectable()
export class PhysiciansService extends TypeOrmCrudService<Physician> {
  constructor(
    @InjectRepository(Physician)
    private readonly repository: Repository<Physician>,
  ) {
    super(repository);
  }
}
