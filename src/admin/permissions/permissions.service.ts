import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Permission } from '../../shared/database';

@Injectable()
export class PermissionsService extends TypeOrmCrudService<Permission> {
  constructor(
    @InjectRepository(Permission)
    public readonly repository: Repository<Permission>,
  ) {
    super(repository);
  }
}
