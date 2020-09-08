import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateRolesDto } from './create-roles.dto';

export class UpdateRolesDto extends PartialType(CreateRolesDto) {

  @ApiProperty()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Display name is required' })
  displayName: string;
}
