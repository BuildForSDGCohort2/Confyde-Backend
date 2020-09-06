import { Injectable, Inject } from '@nestjs/common';
import { Repository, DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Permissions } from '../../shared/database';

@Injectable()
export class PermissionsService extends TypeOrmCrudService<Permissions> {
  constructor(
    @InjectRepository(Permissions)
    public readonly repository: Repository<Permissions>,
  ) {
    super(repository);
  }
}
