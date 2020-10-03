import { ApiProperty } from '@nestjs/swagger';
import { Physician } from '../../../shared/database';

export class PhysicianRegistrationUpdateResponseDto {

  @ApiProperty({ description: 'Status', type: Boolean})
  success: boolean;

  @ApiProperty({ description: 'Message', type: String})
  message: string;

  @ApiProperty({ description: 'Data', type: Physician})
  data: Physician;
}
