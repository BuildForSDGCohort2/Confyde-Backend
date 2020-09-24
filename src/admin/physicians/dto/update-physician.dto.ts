import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { CreatePhysicianDto } from './create-physician.dto';

export class UpdatePhysicianDto extends PartialType(CreatePhysicianDto) {
  @ApiProperty()
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Enter a valid email address' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Username is required' })
  username: string;
}
