import { ReceiveMessageHandler } from './receive-message.command';
import { SendPongCommandHandler } from './send-pong.command';

export const CommandHandlers = [ReceiveMessageHandler, SendPongCommandHandler];
