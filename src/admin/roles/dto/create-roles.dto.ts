import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { IsUnique } from '../../../shared/validations';
import { Role } from '../../../shared/database';

export class CreateRolesDto {
  @ApiProperty()
  @IsUnique(Role)
  @MaxLength(50, { message: 'Name too Long' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty()
  @MaxLength(50, { message: 'Display name too Long' })
  @IsNotEmpty({ message: 'Display name is required' })
  displayName: string;

  @ApiProperty({type: [Number]})
  @IsOptional()
  permissions: number[];
}
