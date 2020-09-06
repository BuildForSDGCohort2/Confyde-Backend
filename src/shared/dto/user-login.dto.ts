import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class UserLoginDto {
  @ApiProperty() @IsNotEmpty() readonly username: string;
  @ApiProperty() @IsNotEmpty() readonly password: string;
}
