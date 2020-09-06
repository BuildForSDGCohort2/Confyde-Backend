import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import {
  ValidationPipe,
  ValidationError,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { Helpers } from './shared/helpers';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const basePath = configService.get('app.base_path');
  let apiDocPath = 'docs';

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    // optionsSuccessStatus: 204,
  });

  Helpers.ensureKeys(configService.get('app.decodedKey'));

  if (basePath) {
    app.setGlobalPrefix(basePath);
    apiDocPath = `${basePath}/${apiDocPath}`;
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const fErrors = {};

        errors.map(err => {
          fErrors[err.property] = [];

          for (const property in err.constraints) {
            if (err.constraints.hasOwnProperty(property)) {
              fErrors[err.property].push(err.constraints[property]);
            }
          }
        });

        return new UnprocessableEntityException({
          message: 'Validation error occured',
          errors: fErrors,
        });
      },
    }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const port = configService.get('app.port');

  const options = new DocumentBuilder()
    .setTitle(`${configService.get('app.name')} API`)
    .setDescription(`${configService.get('app.name')} API Documentation`)
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(apiDocPath, app, document);

  await app.listen(port);
}
bootstrap();
