import { Test, TestingModule } from '@nestjs/testing';
import { KategorijaService } from './kategorija.service';

describe('KategorijaService', () => {
  let service: KategorijaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KategorijaService],
    }).compile();

    service = module.get<KategorijaService>(KategorijaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
