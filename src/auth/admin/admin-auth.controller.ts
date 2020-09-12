import { Controller, Body, Post, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './../../auth/auth.service';
import {
  ApiBody,
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserLoginDto } from './../../shared/dto/user-login.dto';
import { STRINGS } from './../../shared/constants';
import { AdminAuthGuard } from '../guards/admin.guard';
import { Admin } from './../../shared/database';

@ApiTags('Admin - Authentication')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({
    type: UserLoginDto,
  })
  @ApiOkResponse({
    description: 'Returns JSON Object with access-token and expiry',
  })
  @ApiUnauthorizedResponse({
    description: `Return JSON Object with {statusCode: 401, message: ${STRINGS.auth.login.invalid}}`,
  })
  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto) {
    return await this.authService.login(userLoginDto, 'admin');
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT')
  @Get('profile')
  async profile(@Req() req: any): Promise<any> {
    const user = <Admin>req.user;

    delete user.password;

    return user;
  }
}
