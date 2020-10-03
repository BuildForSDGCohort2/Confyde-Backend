import { Controller, Body, Post, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from '../auth.service';
import {
  ApiBody,
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserLoginDto } from '../../shared/dto/user-login.dto';
import { STRINGS } from '../../shared/constants';
import { UserAuthGuard } from '../guards/user.guard';
import { User } from '../../shared/database';

@ApiTags('Users')
@Controller('user/auth')
export class UserAuthController {
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
  async login(@Body() userLoginDto: UserLoginDto): Promise<any> {
    return await this.authService.login(userLoginDto, 'user');
  }

  @UseGuards(UserAuthGuard)
  @ApiBearerAuth('JWT')
  @Get('profile')
  async profile(@Req() req: any): Promise<User> {
    const user = <User>req.user;

    delete user.password;

    return user;
  }
}
