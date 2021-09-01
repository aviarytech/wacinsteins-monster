import { PartialType } from '@nestjs/swagger';
import { CreateMessagesApiDto } from './create-messages-api.dto';

export class UpdateMessagesApiDto extends PartialType(CreateMessagesApiDto) {}
