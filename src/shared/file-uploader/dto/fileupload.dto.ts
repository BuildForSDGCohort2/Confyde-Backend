import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class FileUploadDto {
  @ApiProperty({description: 'Entity types are customer, admin, event, attendant, operator, client'})
  @IsNotEmpty({ message: 'Entity type is required' })
  entityType: string;

  // @ApiProperty({ description: 'Entity ID can be the record ID'})
  // @IsNotEmpty({ message: 'Entity Name is required' })
  // @MaxLength(50, { message: 'User ID too Long' })
  // entityId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'File type is required' })
  fileType: string;

  @ApiProperty({ type: 'file', format: 'binary', description: 'File is required' })
  file: string;
}
