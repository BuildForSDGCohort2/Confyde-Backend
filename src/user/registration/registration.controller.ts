import { PasswordUpdateDto } from './../../shared/dto/password-update.dto';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { UserAuthGuard } from './../../auth/guards/user.guard';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { UsersService } from './../../admin/users/users.service';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { Body, Controller, NotFoundException, Post, Req, Request, UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { User, UserProfile } from './../../shared/database';
import { plainToClass } from 'class-transformer';
import { CompleteUserRegistrationDto } from './dto/complete-user-registration.dto';
import { UserRegistrationUpdateResponseDto } from './dto/user-registration-update_response.dto';

interface UserAPIResponse {
  message: string,
  success?: boolean,
  error?:boolean,
  data?: any 
}

@ApiTags('Users')
@Controller('user')
export class RegistrationController {
  constructor(
    public service: UsersService
  ){}

  @Post('registration')
  async registerUser(
    // @Request() req: Request,
    @Body() dto: UserRegistrationDto,
  ): Promise<any> {
    const data: User = plainToClass(User, dto);

    const user = await this.service.repository.insert(data);

    if (!user) {
      return new UnprocessableEntityException(Error('Registration failed'))
    }

    return {
      message: 'User Registration successful',
      success: true,
    };
  }

  @UseGuards(UserAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiUnprocessableEntityResponse({
    description: 'Returns this error when operation fails'
  })
  @ApiNotFoundResponse({
    description: 'Returns this error when user is not found'
  })
  @ApiOkResponse({
    description: 'Returns complete User profile on successful operation',
    type: UserRegistrationUpdateResponseDto
  })
  @Post('complete-registration')
  async completeRegistration(
    @Request() req: any,
    @Body() dto: CompleteUserRegistrationDto,
  ): Promise<any> {
    const user: User = <User>req.user;

    if (!user) {
      return new NotFoundException(Error('User not found'))
    }

    try {
      const profile = new UserProfile();

      profile.firstName = dto.firstName;
      profile.lastName = dto.lastName;
      profile.biography = dto.biography;
      profile.lastTreatedAilment = dto.lastTreatedAilment;
      profile.phone = dto.phone;
      profile.isAnonymous = dto.isAnonymous;

      user.avatar = dto.avatar;

      user.profile = profile;

      this.service.repository.save(user);

      return {
        message: 'User registration updated successfully',
        success: true,
        data: user
      };

    } catch (ex) {
      return new UnprocessableEntityException(Error('Operation failed'))
    }
  }

  @UseGuards(UserAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiUnprocessableEntityResponse({
    description: 'Returns this error when operation fails'
  })
  @ApiNotFoundResponse({
    description: 'Returns this error when user is not found'
  })
  @ApiOkResponse({
    description: 'Returns complete message on successful operation',
    type: 'Json response',
  })
  @Post('update-password')
  async updateProfile(
    @Request() req: any,
    @Body() dto: PasswordUpdateDto,
  ): Promise<any> {
    const user: User = <User>req.user;

    if (!user) {
      return new NotFoundException(Error('User not found'))
    }

    try {
      user.password = dto.password;

      this.service.repository.save(user);

      return {
        message: 'User password updated successfully',
        success: true,
      } as UserAPIResponse;

    } catch (ex) {
      return new UnprocessableEntityException(Error('Operation failed'))
    }
  }
}
