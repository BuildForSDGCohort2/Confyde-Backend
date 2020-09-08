import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../shared/database';

@Injectable()
export class RolesService extends TypeOrmCrudService<Role> {
  constructor(
    @InjectRepository(Role)
    public readonly repository: Repository<Role>,
  ) {
    super(repository);
  }
}
