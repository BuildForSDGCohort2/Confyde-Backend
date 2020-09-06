import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreatePermissionsDto } from './create-permissions.dto';

export class UpdatePermissionsDto extends PartialType(CreatePermissionsDto) {

  @ApiProperty()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Display name is required' })
  displayName: string;
}
