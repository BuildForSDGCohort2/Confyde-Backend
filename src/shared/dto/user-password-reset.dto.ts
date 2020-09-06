import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class UserPasswordResetDto {
  @ApiProperty({ description: 'Registered Email address' })
  @IsNotEmpty({ message: 'Provide your registered email address' })
  @IsEmail({ allow_ip_domain: false })
  readonly email: string;
}
