import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CompletePhysicianRegistrationDto {

  @ApiProperty({ description: 'First name'})
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty({ description: 'Last name'})
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @ApiProperty({ description: 'Phone number'})
  @IsNotEmpty({ message: 'Phone is required' })
  phone: string;

  @ApiProperty({ description: 'Physician\'s specialty, e.g DERMATOLOGY, OBSTETRICS AND GYNECOLOGY etc'})
  @IsOptional()
  specialty?: string;

  @ApiProperty({ description: 'Employer can be Private Practise or State/Federal Government'})
  @IsOptional()
  employer?: string;

  @ApiProperty({ description: 'Current Hospital of practise'})
  @IsOptional()
  hospital?: string;

  @ApiProperty({ description: 'Physician licensed?'})
  @IsOptional()
  licensed?: number;

  @ApiProperty({ description: 'License issuance date'})
  @IsOptional()
  licenseIssueDate: Date;

  @ApiProperty({ description: 'License expiry date'})
  @IsOptional()
  validityDate: Date;

  @ApiProperty({ description: 'Physician Introduction', required: false})
  @IsOptional()
  biography: string;
  
  @ApiProperty({ description: 'Stay Anonymous', type: Number})
  @IsNotEmpty({ message: 'Phone is required' })
  isAnonymous: number;
  
  @ApiProperty({ description: 'Profile Picture/Avatar', required: false})
  @IsOptional()
  avatar?: string;
}
