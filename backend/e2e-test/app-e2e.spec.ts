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
import { HashingService } from 'src/shared/services/hashing/hashing.service';

describe('Transaction E2E test', () => {
  let app: INestApplication;
  let userRepo: MockType<Repository<UserEntity>>;
  let refreshTokenRepo: MockType<Repository<RefreshTokenEntity>>;
  let hashingService: HashingService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TestModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());

    userRepo = moduleRef.get(getRepositoryToken(UserEntity));
    refreshTokenRepo = moduleRef.get(getRepositoryToken(RefreshTokenEntity));
    hashingService = moduleRef.get<HashingService>(HashingService);

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

    describe('Login Workflow', () => {
      const url = '/auth/login';
      const refreshTokenId = 'def456';
      const userId = 'abc123';
      const password = 'yeet';
      const username = 'yote';
      let hashedPassword = '';

      beforeEach(async () => {
        hashedPassword = await hashingService.hashPassword(password);
      });

      it('should throw 401 Unauthenticated if the input password does not match stored db password', async () => {
        jest
          .spyOn(userRepo, 'findOne')
          .mockImplementation(async () => ({ username, hashedPassword }));

        const response = await request(app.getHttpServer()).post(url).send({
          username,
          password: 'invalidPassword',
        });

        expect(response.statusCode).toBe(401);
      });

      it('should set cookie and return token credentials data if login success', async () => {
        jest.spyOn(userRepo, 'findOne').mockImplementation(async () => ({
          username,
          hashedPassword,
          id: userId,
        }));

        jest
          .spyOn(refreshTokenRepo, 'save')
          .mockImplementation(async () => ({ id: refreshTokenId }));

        const response = await request(app.getHttpServer()).post(url).send({
          username,
          password,
        });

        expect(response.statusCode).toBe(201);
        expect(response.body.userId).toBe(userId);

        const responseCookie = response.headers['set-cookie'][0].split('=');
        expect(responseCookie[0]).toBe('demo-refresh-token');
        expect(responseCookie[1]).toBeDefined();
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
