import { PhysicianProfile } from '../../../shared/database/entity/physician_profile.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { IsEqual, IsUnique } from '../../../shared/validations';
import { Physician } from '../../../shared/database';

export class CreatePhysicianDto {
  @ApiProperty({ description: 'Email address'})
  @IsUnique(Physician)
  @MaxLength(50, { message: 'Email too Long' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Enter a valid email address' })
  email: string;

  @ApiProperty({ description: 'Username'})
  @IsUnique(Physician)
  @MaxLength(50, { message: 'Username too Long' })
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @ApiProperty({ description: 'A  Secure password'})
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @ApiProperty({ description: 'Confirm Password'})
  @IsEqual('password', { message: 'Passwords does not match' })
  @IsNotEmpty({ message: 'Password Confirmation is required' })
  passwordConfirmation: string;

  @ApiProperty({ description: 'Profile picture (optional)'})
  @IsOptional()
  avatar: string;

  @ApiProperty({description: 'Account status (optional)', type: Number })
  @IsNotEmpty({ message: 'Status is required' })
  status: number;

  @ApiProperty({ description: 'Physician Profile Data', type: PhysicianProfile })
  @IsNotEmpty({ message: 'Physician Profile is required'})
  profile: PhysicianProfile;
}
