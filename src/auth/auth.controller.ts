import { Encrypter } from '../shared/encrypter';
import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

// @ApiTags('Admin Authentication Module')
@Controller('auth')
export class AuthController {
  // constructor() {}

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
