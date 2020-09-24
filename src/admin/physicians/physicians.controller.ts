import { PhysicianProfile } from './../../shared/database/entity/physician_profile.entity';
import { Physician } from './../../shared/database/entity/physician.entity';
import { Controller, Patch, Post, UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/auth/guards/admin.guard';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { CreatePhysicianDto } from './dto/create-physician.dto';
import { UpdatePhysicianDto } from './dto/update-physician.dto';
import { PhysiciansService } from './physicians.service';
import { plainToClass } from 'class-transformer';
import { ValidateUniqueParam } from 'src/shared/validations';

@Crud({
  model: {
    type: Physician,
  },
  dto: {
    create: CreatePhysicianDto,
    update: UpdatePhysicianDto,
    replace: UpdatePhysicianDto,
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
      profile: {
        exclude: ['createdAt', 'updatedAt'],
        eager: true,
      },
    },
  },
})
@ApiTags('Physicians (Admin)')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('JWT')
@Controller('admin/physicians')
export class PhysiciansController implements CrudController<Physician> {
  constructor(
    public service: PhysiciansService,
  ) {}

  get base(): CrudController<Physician> {
    return this;
  }
  
  @Override()
  @Post()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreatePhysicianDto,
  ): Promise<any> {
    const data: Physician = plainToClass(Physician, dto);
    const profile: PhysicianProfile = dto.profile;

    if (!profile.firstName) {
      return new UnprocessableEntityException({
        message: 'Validation error occured',
        errors: {
          operator: ['First name is required'],
        }
      });
    }

    if (!profile.lastName) {
      return new UnprocessableEntityException({
        message: 'Validation error occured',
        errors: {
          operator: ['Last name is required'],
        }
      });
    }

    if (!profile.phone) {
      return new UnprocessableEntityException({
        message: 'Validation error occured',
        errors: {
          operator: ['Phone number is required'],
        }
      });
    }

    return this.base.createOneBase(req, data);
  }

  @ApiBody({
    type: UpdatePhysicianDto,
  })
  @Override()
  @Patch('physicians/:id')
  async updateOne(
    @ParsedRequest() req: CrudRequest,
    @ValidateUniqueParam({
      name: 'email',
      field: 'email',
      entity: Physician,
      mode: 'Update',
      table: 'physicians',
    })
    uniqEmail: boolean,
    @ValidateUniqueParam({
      name: 'username',
      field: 'username',
      entity: Physician,
      mode: 'Update',
      table: 'physicians',
    })
    uniqUsername: boolean,
    @ParsedBody() dto: Partial<UpdatePhysicianDto>,
  ): Promise<any> {
    const data: Physician = plainToClass(Physician, dto);
    const profile: PhysicianProfile = data.profile;

    if (!profile.firstName) {
      return new UnprocessableEntityException({
        message: 'Validation error occured',
        errors: {
          operator: ['First name is required'],
        }
      });
    }

    if (!profile.lastName) {
      return new UnprocessableEntityException({
        message: 'Validation error occured',
        errors: {
          operator: ['Last name is required'],
        }
      });
    }

    if (!profile.phone) {
      return new UnprocessableEntityException({
        message: 'Validation error occured',
        errors: {
          operator: ['Phone number is required'],
        }
      });
    }

    return this.base.updateOneBase(req, data);
  }
}
