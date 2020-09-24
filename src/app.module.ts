import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from './shared/database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';

// Import Configuration files
import databaseConfig from './shared/config/database.config';
import appConfig from './shared/config/app.config';
import mailConfig from './shared/config/mail.config';
import * as handlebars from 'handlebars';
import { Encrypter } from './shared/encrypter';
import { FileUploaderModule } from './shared/file-uploader/file-uploader.module';

const helpers = (configService: ConfigService) => ({
  config(value: string) {
    const context = {
      value: configService.get(value),
    };

    const template = handlebars.compile('{{ value }}');

    const compiled = template(context);

    return compiled;
  },
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig, mailConfig],
    }),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('mail.host'),
          port: configService.get('mail.port'),
          secure: false, // configService.get('mail.secure'), // upgrade later with STARTTLS
          // requireTLS: true,
          auth: {
            user: configService.get('mail.username'),
            pass: configService.get('mail.password'),
          },
          tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: false,
          },
          // debug: true,
          // logger: true,
        },
        defaults: {
          from: `"${configService.get('mail.from_name')}" <${configService.get(
            'mail.from_email',
          )}>`,
        },
        preview: true,
        template: {
          dir: `${process.cwd()}/templates/email/`,
          adapter: new HandlebarsAdapter(helpers(configService)),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    DatabaseModule,
    AdminModule,
    AuthModule,
    FileUploaderModule,
  ],
  controllers: [AppController],
  providers: [AppService, Encrypter],
  exports: [Encrypter],
})
export class AppModule {}
