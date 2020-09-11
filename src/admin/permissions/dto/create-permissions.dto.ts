import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { IsUnique } from '../../../shared/validations';
import { Permission } from '../../../shared/database';

export class CreatePermissionsDto {
  @ApiProperty()
  @IsUnique(Permission)
  @MaxLength(50, { message: 'Name too Long' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty()
  @MaxLength(50, { message: 'Display name too Long' })
  @IsNotEmpty({ message: 'Display name is required' })
  displayName: string;

  @ApiProperty({ description: 'Group name' })
  @IsOptional()
  groupName: string;
}
