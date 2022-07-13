import { Test, TestingModule } from '@nestjs/testing';
import { ApsisengineController } from './apsisengine.controller';

describe('ApsisengineController', () => {
  let controller: ApsisengineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApsisengineController],
    }).compile();

    controller = module.get<ApsisengineController>(ApsisengineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
