import { Controller, Patch, Post, UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { plainToClass } from 'class-transformer';
import { AdminAuthGuard } from 'src/auth/guards/admin.guard';
import { ValidateUniqueParam } from 'src/shared/validations';
import { User, UserProfile } from './../../shared/database';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Crud({
  model: {
    type: User,
  },
  dto: {
    create: CreateUserDto,
    update: UpdateUserDto,
    replace: UpdateUserDto,
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
        // persist: ['id', 'name', 'display_name'],
        exclude: ['createdAt', 'updatedAt'],
        eager: true,
      },
      medicalHisory: {
        // persist: ['id', 'name', 'display_name'],
        exclude: ['createdAt', 'updatedAt'],
        eager: true,
      },
    },
  },
})
@ApiTags('Users (Admin)')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('JWT')
@Controller('admin/users')
export class UsersController implements CrudController<User> {
  constructor(
    public service: UsersService,
  ) {}

  get base(): CrudController<User> {
    return this;
  }
  
  @Override()
  @Post()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateUserDto,
  ): Promise<any> {
    const data: User = plainToClass(User, dto);
    const profile: UserProfile = dto.profile;

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
    type: UpdateUserDto,
  })
  @Override()
  @Patch('users/:id')
  async updateOne(
    @ParsedRequest() req: CrudRequest,
    @ValidateUniqueParam({
      name: 'email',
      field: 'email',
      entity: User,
      mode: 'Update',
      table: 'users',
    })
    uniqEmail: boolean,
    @ParsedBody() dto: Partial<UpdateUserDto>,
  ): Promise<any> {
    const data: User = plainToClass(User, dto);
    const profile: UserProfile = data.profile;

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
