import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GeneratePermissionsDto {
  @ApiProperty({
    description: 'Name of Entity or Database table',
  })
  @IsNotEmpty({ message: 'Entity/Table name is required' })
  entity: string;

  @ApiProperty({
    type: [String] || String,
  })
  @IsString({ each: true, message: 'Valid Crud Action(s) is required' })
  @IsNotEmpty({ message: 'Crud Action is required' })
  crud: [string] | string;
}
