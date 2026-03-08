import { Test, TestingModule } from '@nestjs/testing';
import { RezervacijaController } from './rezervacija.controller';

describe('RezervacijaController', () => {
  let controller: RezervacijaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RezervacijaController],
    }).compile();

    controller = module.get<RezervacijaController>(RezervacijaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
