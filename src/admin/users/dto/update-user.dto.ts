import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Enter a valid email address' })
  email: string;
}
