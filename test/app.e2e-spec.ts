import { Encrypter } from './../src/shared/encrypter';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getConnectionManager } from 'typeorm';

afterAll(async done => {
  try {
    const conn = getConnectionManager().get('default') ?? null;
    if (conn) {
      await conn.close();
    }
  } catch (_) {
    console.log('Database Connection not Found');
  } finally {
    done();
  }
});

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [Encrypter],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
