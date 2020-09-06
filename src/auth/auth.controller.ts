import { Encrypter } from '../shared/encrypter';
import { Helpers } from '../shared/helpers';
import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { ApiBody, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserLoginDto } from '../shared/dto/user-login.dto';
import { AdminAuthGuard } from './guards/admin.guard';
import { ConfigService } from '@nestjs/config';

// @ApiTags('Admin Authentication Module')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
    private encrypter: Encrypter,
  ) { }

  // @ApiBody({
  //   type: UserLoginDto,
  // })
  // @Post('admin/login')
  // async login(@Body() userLoginDto: UserLoginDto) {
  //   return await this.authService.login(userLoginDto, 'admin');
  // }

  // @UseGuards(AdminAuthGuard)
  // @ApiBearerAuth('JWT')
  // @Get('test')
  // async test() {
  //   const encoded = this.encrypter.encrypt({ name: 'George' });

  //   return {
  //     encoded,
  //     decoded: this.encrypter.decrypt(encoded, true),
  //   }
  // }
}
