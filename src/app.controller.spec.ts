import { ConfigService, ConfigModule } from '@nestjs/config';
import { AdminUsersService } from './admin/admin-users/admin-users.service';
import { RolesService } from './admin/roles/roles.service';
import { PermissionsService } from './admin/permissions/permissions.service';
import { Encrypter } from './shared/encrypter';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [AppController],
      providers: [AppService, Encrypter, ConfigService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
