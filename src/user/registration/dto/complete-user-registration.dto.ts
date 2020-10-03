import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CompleteUserRegistrationDto {

  @ApiProperty({ description: 'First name'})
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty({ description: 'Last name'})
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @ApiProperty({ description: 'Phone number'})
  @IsNotEmpty({ message: 'Phone is required' })
  phone: string;
  
  @ApiProperty({ description: 'User Introduction', required: false})
  @IsOptional()
  biography: string;
  
  @ApiProperty({ description: 'Stay Anonymous', type: Number})
  @IsNotEmpty({ message: 'Phone is required' })
  isAnonymous: number;
  
  @ApiProperty({ description: 'Last ailment treated', required: false})
  @IsOptional()
  lastTreatedAilment: string;
  
  @ApiProperty({ description: 'Profile Picture/Avatar', required: false})
  @IsOptional()
  avatar?: string;
}
