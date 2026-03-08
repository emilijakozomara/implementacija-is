import { Test, TestingModule } from '@nestjs/testing';
import { RezervacijaService } from './rezervacija.service';

describe('RezervacijaService', () => {
  let service: RezervacijaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RezervacijaService],
    }).compile();

    service = module.get<RezervacijaService>(RezervacijaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
