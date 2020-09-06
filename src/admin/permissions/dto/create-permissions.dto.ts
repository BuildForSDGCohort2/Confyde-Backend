import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, MinLength, MaxLength, IsOptional, Equals, Allow, IsInt, IsNumberString } from 'class-validator';
import { IsUnique, IsEqual } from '../../../shared/validations';
import { Permissions } from '../../../shared/database';

export class CreatePermissionsDto {
  @ApiProperty()
  @IsUnique(Permissions)
  @MaxLength(50, { message: 'Name too Long' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty()
  @MaxLength(50, { message: 'Display name too Long' })
  @IsNotEmpty({ message: 'Display name is required' })
  displayName: string;

  @ApiProperty()
  @IsOptional()
  tableName: string;
}
