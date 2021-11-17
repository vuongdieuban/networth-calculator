import * as dotenv from 'dotenv';
dotenv.config({ path: '../dev.env' });

import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TestModule } from './test.module';
import { UserEntity } from 'src/user/entities/user.entity';
import { RefreshTokenEntity } from 'src/auth/entities/refresh-token.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType } from 'src/shared/utils/test-utils';
import { Repository } from 'typeorm';

describe('Transaction E2E test', () => {
  let app: INestApplication;
  let userRepo: MockType<Repository<UserEntity>>;
  let refreshTokenRepo: MockType<Repository<RefreshTokenEntity>>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TestModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());

    userRepo = moduleRef.get(getRepositoryToken(UserEntity));
    refreshTokenRepo = moduleRef.get(getRepositoryToken(RefreshTokenEntity));

    await app.init();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Auth E2E Test', () => {
    describe('Register Workflow', () => {
      const url = '/auth/register';

      it('should throw 400 validation error if the request payload is invalid', async () => {
        expect.hasAssertions();

        const requestPayloads = [
          { username: 'test', password: undefined },
          { username: undefined, password: 'test' },
        ];

        const requestPromises = requestPayloads.map((payload) => {
          return request(app.getHttpServer()).post(url).send(payload);
        });

        const responses = await Promise.all(requestPromises);

        responses.forEach((response) => {
          expect(response.statusCode).toBe(400);
        });
      });

      it('should throw 409 if trying to register existed user', async () => {
        const username = 'test';
        jest.spyOn(userRepo, 'findOne').mockImplementation(async () => ({ username }));

        const response = await request(app.getHttpServer())
          .post(url)
          .send({ username, password: 'password' });

        expect(response.statusCode).toBe(409);
      });

      it('should create and return userId if user does not exist', async () => {
        const userId = 'test';
        jest.spyOn(userRepo, 'findOne').mockImplementation(async () => undefined);
        jest.spyOn(userRepo, 'create').mockImplementation(async () => ({ id: userId }));

        const response = await request(app.getHttpServer())
          .post(url)
          .send({ username: 'test', password: 'test' });

        expect(response.statusCode).toBe(201);
        expect(response.body.userId).toBe(userId);
      });
    });

    describe('Login Workflow', () => {});
  });

  afterAll(async () => {
    await app.close();
  });
});
