import { Test, TestingModule } from '@nestjs/testing';
import { ValutaService } from './valuta.service';

describe('ValutaService', () => {
  let service: ValutaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValutaService],
    }).compile();

    service = module.get<ValutaService>(ValutaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
