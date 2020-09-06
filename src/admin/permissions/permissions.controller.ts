import { Helpers } from '../../shared/helpers';
import { GeneratePermissionsDto } from './dto/generate-permissions.dto';
import {
  Controller,
  Patch,
  Post,
  UseInterceptors,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  Override,
  CrudRequest,
  ParsedRequest,
  ParsedBody,
  CrudRequestInterceptor,
  CreateManyDto,
} from '@nestjsx/crud';
import { plainToClass } from 'class-transformer';
import { CreatePermissionsDto } from './dto/create-permissions.dto';
import { UpdatePermissionsDto } from './dto/update-permissions.dto';
import { Permissions } from '../../shared/database';
import { PermissionsService } from './permissions.service';
import { AdminAuthGuard } from '../../auth/guards/admin.guard';

@Crud({
  model: {
    type: Permissions,
  },
  dto: {
    create: CreatePermissionsDto,
    update: UpdatePermissionsDto,
  },
  routes: {
    exclude: [
      'replaceOneBase',
      // 'createManyBase',
    ],
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
  },
})
@ApiTags('Permissions (Admin)')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('JWT')
@Controller('admin/permissions')
export class PermissionsController implements CrudController<Permissions> {
  constructor(public service: PermissionsService) {}

  get base(): CrudController<Permissions> {
    return this;
  }

  @ApiBody({
    type: UpdatePermissionsDto,
  })
  @Override()
  @Patch(':id')
  async updateOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Partial<UpdatePermissionsDto>,
  ): Promise<any> {
    const data: Permissions = plainToClass(Permissions, dto);

    return this.base.updateOneBase(req, data);
  }

  @ApiBody({ type: GeneratePermissionsDto })
  @ApiOperation({
    summary:
      'Generate CRUD Operation permissions (Browse Read Edit Add Delete)',
  })
  @UseInterceptors(CrudRequestInterceptor)
  @Post('generate')
  async generatePermissions(
    @ParsedRequest() req: CrudRequest,
    @Body() dto: GeneratePermissionsDto,
  ) {
    const permissions = [];
    const actions: string[] | string =
      typeof dto.crud === 'string' && dto.crud === 'all'
        ? ['browse', 'read', 'edit', 'add', 'delete']
        : dto.crud;
    if (typeof actions === 'object') {
      actions.slice(0).map<string>(action => {
        const table = dto.entity.toLowerCase();
        const name = `${action}-${table}`;
        const displayName = Helpers.titleCase(`${action} ${table}`);
        permissions.push({
          name,
          displayName,
        });

        return action;
      });
    }

    const manyEntity: CreateManyDto = {
      bulk: plainToClass(Permissions, permissions),
    };

    return this.base.createManyBase(req, manyEntity);
  }
}
