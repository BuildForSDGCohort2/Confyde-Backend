import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../shared/database';

export class UserRegistrationUpdateResponseDto {

  @ApiProperty({ description: 'Status', type: Boolean})
  success: boolean;

  @ApiProperty({ description: 'Message', type: String})
  message: string;

  @ApiProperty({ description: 'Data', type: User})
  data: User;
}
