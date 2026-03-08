import { Test, TestingModule } from '@nestjs/testing';
import { ValutaController } from './valuta.controller';

describe('ValutaController', () => {
  let controller: ValutaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ValutaController],
    }).compile();

    controller = module.get<ValutaController>(ValutaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
