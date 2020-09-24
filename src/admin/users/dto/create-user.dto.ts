import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { IsEqual, IsUnique } from '../../../shared/validations';
import { User, UserProfile } from '../../../shared/database';

export class CreateUserDto {
  @ApiProperty({ description: 'Email address'})
  @IsUnique(User)
  @MaxLength(50, { message: 'Email too Long' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Enter a valid email address' })
  email: string;

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

  @ApiProperty({ description: 'User Profile Data', type: UserProfile })
  @IsNotEmpty({ message: 'User Profile is required'})
  profile: UserProfile;
}
