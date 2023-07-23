import { Module } from '@nestjs/common';
import { MessagesGateway } from './messages.gateway';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [MessagesGateway],
  imports:[UsersModule]
})
export class MessagesModule {}