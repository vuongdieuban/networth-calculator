import * as dotenv from 'dotenv';
dotenv.config({ path: '../test.env' });

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';

describe('App E2E test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());

    await app.init();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Auth e2e test', () => {
    it('should throw 400 validation error if register payload is invalid', async () => {
      const url = '/auth/register';
      const response = await request(app.getHttpServer()).post(url).send({
        username: 'test',
      });

      console.log('response', response.body);
      expect(response.status).toBe(400);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
