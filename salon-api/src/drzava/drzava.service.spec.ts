import { Test, TestingModule } from '@nestjs/testing';
import { DrzavaService } from './drzava.service';

describe('DrzavaService', () => {
  let service: DrzavaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DrzavaService],
    }).compile();

    service = module.get<DrzavaService>(DrzavaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
