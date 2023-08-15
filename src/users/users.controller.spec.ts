import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { UserRoom } from '../entities/user-room.entity';
import { AuthGuard } from './../auth/auth.guard';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

describe('UsersController', () => {
  let controller: UsersController;
  let userServiceMock: any;

  beforeEach(async () => {
    userServiceMock = {
      findAllRooms: jest.fn(),
      getUser: jest.fn(),
      getUsersInRoom: jest.fn(),
      getRoomMessages: jest.fn(),
      getUserRooms: jest.fn(),
      createRoom: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: userServiceMock,
        },
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: Reflector,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

});
