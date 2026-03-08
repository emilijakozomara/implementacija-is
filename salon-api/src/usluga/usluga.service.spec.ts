import { Test, TestingModule } from '@nestjs/testing';
import { UslugaService } from './usluga.service';

describe('UslugaService', () => {
  let service: UslugaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UslugaService],
    }).compile();

    service = module.get<UslugaService>(UslugaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
