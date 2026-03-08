import { Test, TestingModule } from '@nestjs/testing';
import { UslugaController } from './usluga.controller';

describe('UslugaController', () => {
  let controller: UslugaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UslugaController],
    }).compile();

    controller = module.get<UslugaController>(UslugaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
