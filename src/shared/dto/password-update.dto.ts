import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsEqual } from '../validations';

export class PasswordUpdateDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password Confirmation is required' })
  @IsEqual('password', { message: 'Passwords does not match' })
  passwordConfirmation: string;
}
