import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserRoom } from '../entities/user-room.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserRoomSessions } from '../entities/user-room-sessions.entity';
import { RoomMessages } from '../entities/room-messages.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User]),
  TypeOrmModule.forFeature([UserRoom]),
  TypeOrmModule.forFeature([UserRoomSessions]),
  TypeOrmModule.forFeature([RoomMessages]),
   
],
  controllers: [UsersController],
  providers: [UsersService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }],
  exports:[UsersService]
})
export class UsersModule {}
