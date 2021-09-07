import { Test, TestingModule } from '@nestjs/testing';
import { MessageWebsocketGateway } from './message-websocket.gateway';

describe('MessageWebsocketGateway', () => {
  let gateway: MessageWebsocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageWebsocketGateway],
    }).compile();

    gateway = module.get<MessageWebsocketGateway>(MessageWebsocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
