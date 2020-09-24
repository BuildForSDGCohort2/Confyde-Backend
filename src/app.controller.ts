import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Encrypter } from './shared/encrypter';
import { replaceInFile } from 'replace-in-file';
import { Helpers } from './shared/helpers';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private encrypter: Encrypter,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/keys')
  async newAppKeys(
    @Query('pass') pass: string,
    @Query('output') output?: boolean,
  ): Promise<string> {
    const akRegex = new RegExp(/APP_KEY?\w.*/);

    if (pass !== 'confyde') {
      return 'Wrong Password, please try again';
    }

    const newAppKey = this.encrypter.base64_encode(
      this.encrypter.generateKey('AES-128-CBC').toString('hex'),
    );

    if (output as unknown as string === 'true') {
      return `New Application Key: ${newAppKey}, please keep it safe.`;
    }

    // const portRegex = new RegExp(/(PORT)=[0-9]{0,}/);

    const options = {
      files: [process.cwd() + '/.env'],
    };

    try {
      await replaceInFile({
        from: akRegex,
        to: `APP_KEY=${newAppKey}`,
        ...options,
      });

      // tslint:disable-next-line: no-console
      // console.log('Replacement results:', results);

      // tslint:disable-next-line: no-console
      // console.log('Generating new Public and Private Keys');

      Helpers.ensureKeys(newAppKey, true);
      // this.configService. // .reload();

      // tslint:disable-next-line: no-console
      // console.log('New Public and Private Keys Generated');
    } catch (error) {
      // tslint:disable-next-line: no-console
      // console.error('Error occurred:', error);
    }

    return 'New App Keys Generated';
  }
}
