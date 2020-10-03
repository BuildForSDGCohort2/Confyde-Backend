import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { IsEqual, IsUnique } from '../../../shared/validations';
import { Physician } from '../../../shared/database';

export class PhysicianRegistrationDto {
  @ApiProperty({ description: 'Email address'})
  @IsUnique(Physician)
  @MaxLength(100, { message: 'Email too Long' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Enter a valid email address' })
  email: string;

  @ApiProperty({ description: 'Username'})
  @IsUnique(Physician)
  @MaxLength(20, { message: 'Username too Long' })
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @ApiProperty({ description: 'A  Secure password'})
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @ApiProperty({ description: 'Confirm Password'})
  @IsEqual('password', { message: 'Passwords does not match' })
  @IsNotEmpty({ message: 'Password Confirmation is required' })
  passwordConfirmation: string;
}
