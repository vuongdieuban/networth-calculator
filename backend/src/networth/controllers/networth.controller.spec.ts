import { Test, TestingModule } from '@nestjs/testing';
import { NetworthController } from './networth.controller';

describe('NetworthController', () => {
  let controller: NetworthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NetworthController],
    }).compile();

    controller = module.get<NetworthController>(NetworthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
