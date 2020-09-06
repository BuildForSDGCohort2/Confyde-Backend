import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Admin } from '../../shared/database';

@Injectable()
export class AdminUsersService extends TypeOrmCrudService<Admin> {
  constructor(
    @InjectRepository(Admin)
    private readonly repository: Repository<Admin>,
  ) {
    super(repository);
  }
}
