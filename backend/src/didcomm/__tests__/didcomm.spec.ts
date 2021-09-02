import { Test, TestingModule } from '@nestjs/testing';
import { DIDCommService } from '../didcomm.service';

describe('DIDCommService', () => {
  let service: DIDCommService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DIDCommService],
    }).compile();

    service = module.get<DIDCommService>(DIDCommService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
