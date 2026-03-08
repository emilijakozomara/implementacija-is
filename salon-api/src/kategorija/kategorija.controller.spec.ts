import { Test, TestingModule } from '@nestjs/testing';
import { KategorijaController } from './kategorija.controller';

describe('KategorijaController', () => {
  let controller: KategorijaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KategorijaController],
    }).compile();

    controller = module.get<KategorijaController>(KategorijaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
