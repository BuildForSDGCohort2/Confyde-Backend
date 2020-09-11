import { AdminAuthGuard } from '../../auth/guards/admin.guard';
import { Controller, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  Override,
  CrudRequest,
  ParsedRequest,
  ParsedBody,
} from '@nestjsx/crud';
import { plainToClass } from 'class-transformer';
import { AdminUsersService } from './admin-users.service';
import { Admin } from '../../shared/database';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { RolesService } from '../roles/roles.service';

@Crud({
  model: {
    type: Admin,
  },
  dto: {
    create: CreateAdminDto,
    update: UpdateAdminDto,
    replace: UpdateAdminDto,
  },
  routes: {
    exclude: ['replaceOneBase', 'createManyBase'],
    deleteOneBase: {
      returnDeleted: false,
    },
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    exclude: ['password', 'deletedAt'],
    join: {
      role: {
        persist: ['id', 'name', 'display_name'],
        exclude: ['createdAt', 'updatedAt'],
        eager: true,
      },
      roles: {
        persist: ['id', 'name', 'display_name'],
        exclude: ['createdAt', 'updatedAt'],
        eager: true,
      },
    },
  },
})
@ApiTags('Admin Users (Admin)')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('JWT')
@Controller('admin/admin-users')
export class AdminUsersController implements CrudController<Admin> {
  constructor(
    public service: AdminUsersService,
    private rolesService: RolesService,
  ) {}

  get base(): CrudController<Admin> {
    return this;
  }

  @ApiBody({
    type: UpdateAdminDto,
  })
  @Override()
  @Patch('admin-users/:id')
  async updateOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Partial<UpdateAdminDto>,
  ): Promise<any> {
    const data: Admin = plainToClass(Admin, dto);
    const roleIds: number[] = dto.roles || [];
    const role: number = dto.role;

    data.role =
      role > 0 ? await this.rolesService.repository.findOne(role) : null;

    data.roles = roleIds.length
      ? await this.rolesService.repository.findByIds(roleIds)
      : [];

    return this.base.updateOneBase(req, data);
  }
}
