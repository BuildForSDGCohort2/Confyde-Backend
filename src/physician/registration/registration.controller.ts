/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { PhysicianAuthGuard } from './../../auth/guards/physician.guard';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { PhysiciansService } from './../../admin/physicians/physicians.service';
import { PhysicianRegistrationDto } from './dto/physician-registration.dto';
import { Body, Controller, NotFoundException, Post, Request, UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { Physician, PhysicianProfile } from './../../shared/database';
import { plainToClass } from 'class-transformer';
import { PasswordUpdateDto } from './../../shared/dto/password-update.dto';
import { CompletePhysicianRegistrationDto } from './dto/complete-physician-registration.dto';
import { PhysicianRegistrationUpdateResponseDto } from './dto/physician-registration-update_response.dto';

interface PhysicianAPIResponse {
  message: string,
  success?: boolean,
  error?:boolean,
  data?: any 
}

@ApiTags('Physicians')
@Controller('physician')
export class RegistrationController {
  constructor(
    public service: PhysiciansService
  ){}

  @Post('registration')
  async registerPhysician(
    @Body() dto: PhysicianRegistrationDto,
  ): Promise<any> {
    const data: Physician = plainToClass(Physician, dto);

    const user = await this.service.repository.insert(data);

    if (!user) {
      return new UnprocessableEntityException(Error('Registration failed'))
    }

    return {
      message: 'Physician Registration successful',
      success: true,
    };
  }

  @UseGuards(PhysicianAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiUnprocessableEntityResponse({
    description: 'Returns this error when operation fails'
  })
  @ApiNotFoundResponse({
    description: 'Returns this error when user is not found'
  })
  @ApiOkResponse({
    description: 'Returns complete Physician profile on successful operation',
    type: PhysicianRegistrationUpdateResponseDto
  })
  @Post('complete-registration')
  async completeRegistration(
    @Request() req: any,
    @Body() dto: CompletePhysicianRegistrationDto,
  ): Promise<any> {
    const user: Physician = <Physician>req.user;

    if (!user) {
      return new NotFoundException(Error('Physician not found'))
    }

    try {
      const profile = new PhysicianProfile();

      profile.firstName = dto.firstName;
      profile.lastName = dto.lastName;
      profile.biography = dto.biography;
      profile.phone = dto.phone;
      profile.licensed = dto.licensed;
      profile.specialty = dto.specialty;
      profile.employer = dto.employer;
      profile.hospital = dto.hospital;
      profile.licenseIssueDate = dto.licenseIssueDate;
      profile.validityDate = dto.validityDate;
      profile.isAnonymous = dto.isAnonymous;

      user.avatar = dto.avatar;

      user.profile = profile;

      this.service.repository.save(user);

      return {
        message: 'Physician registration updated successfully',
        success: true,
        data: user
      };

    } catch (ex) {
      return new UnprocessableEntityException(Error('Operation failed'))
    }
  }

  @UseGuards(PhysicianAuthGuard)
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
    const user: Physician = <Physician>req.user;

    if (!user) {
      return new NotFoundException(Error('Physician not found'))
    }

    try {
      user.password = dto.password;

      this.service.repository.save(user);

      return {
        message: 'Physician password updated successfully',
        success: true,
      } as PhysicianAPIResponse;

    } catch (ex) {
      return new UnprocessableEntityException(Error('Operation failed'))
    }
  }
}
