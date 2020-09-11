import { PermissionsService } from './../permissions/permissions.service';
import { Controller, Patch, Post, UseGuards } from '@nestjs/common';
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
import { CreateRolesDto } from './dto/create-roles.dto';
import { UpdateRolesDto } from './dto/update-roles.dto';
import { Role } from '../../shared/database';
import { RolesService } from './roles.service';
import { AdminAuthGuard } from '../../auth/guards/admin.guard';

@Crud({
  model: {
    type: Role,
  },
  dto: {
    create: CreateRolesDto,
    update: UpdateRolesDto,
  },
  routes: {
    exclude: ['replaceOneBase'],
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
    exclude: ['deletedAt'],
    join: {
      permissions: {
        persist: ['id', 'name', 'display_name'],
        exclude: ['createdAt', 'updatedAt', 'tableName'],
        eager: true,
      },
    },
  },
})
@ApiTags('Roles (Admin)')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('JWT')
@Controller('admin/roles')
export class RolesController implements CrudController<Role> {
  constructor(
    public service: RolesService,
    private permissionService: PermissionsService,
  ) {}

  get base(): CrudController<Role> {
    return this;
  }

  @Override()
  @Post()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateRolesDto,
  ): Promise<any> {
    const data: Role = plainToClass(Role, dto);
    const permissionIds: number[] = dto.permissions ? dto.permissions : [];

    const perms = permissionIds.length
      ? await this.permissionService.repository.findByIds(permissionIds)
      : [];

    if (perms.length) {
      data.permissions = perms;
    }

    return this.base.createOneBase(req, data);
  }

  @ApiBody({
    type: UpdateRolesDto,
  })
  @Override()
  @Patch(':id')
  async updateOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Partial<UpdateRolesDto>,
  ): Promise<any> {
    const data: Role = plainToClass(Role, dto);
    const permissionIds: number[] = dto.permissions ? dto.permissions : [];

    data.permissions = permissionIds.length
      ? await this.permissionService.repository.findByIds(permissionIds)
      : [];

    return this.base.updateOneBase(req, data);
  }
}
