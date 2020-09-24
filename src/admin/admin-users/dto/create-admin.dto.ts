import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  MaxLength,
  IsOptional,
  Allow,
} from 'class-validator';
import { IsEqual, IsUnique } from '../../../shared/validations';
import { Admin } from '../../../shared/database';

export class CreateAdminDto {
  @ApiProperty()
  @MaxLength(50, { message: 'Firstname too Long' })
  @IsNotEmpty({ message: 'Firstname is required' })
  firstName: string;

  @ApiProperty()
  @MaxLength(50, { message: 'Lastname too Long' })
  @IsNotEmpty({ message: 'Lastname is required' })
  lastName: string;

  @ApiProperty()
  @IsUnique(Admin)
  @MaxLength(50, { message: 'Email too Long' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Enter a valid email address' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @ApiProperty()
  @IsEqual('password', { message: 'Passwords does not match' })
  @IsNotEmpty({ message: 'Password Confirmation is required' })
  passwordConfirmation: string;

  @ApiProperty()
  @IsOptional()
  avatar: string;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber({}, { message: 'Invalid Role' })
  role: number;

  @ApiProperty({ type: [Number] })
  @IsOptional()
  @Allow()
  roles: number[];

  @ApiProperty({ type: Number })
  @IsNotEmpty({ message: 'Status is required' })
  status: number;
}
