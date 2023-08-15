import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { UserRoom } from '../entities/user-room.entity';
import { UserRoomSessions } from '../entities/user-room-sessions.entity';
import { RoomMessages } from '../entities/room-messages.entity';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepositoryMock: any;
  let userRoomRepositoryMock: any;
  let userRoomSessionRepositoryMock: any;
  let roomMessagesRepositoryMock: any;

  beforeEach(async () => {
    userRepositoryMock = {
      save: jest.fn(),
      findOne: jest.fn(),
      exist: jest.fn(),
      delete: jest.fn(),
    };
    userRoomRepositoryMock = {
      save: jest.fn(),
      find: jest.fn(),
      findBy: jest.fn(),
      query: jest.fn(),
    };
    userRoomSessionRepositoryMock = {
      save: jest.fn(),
    };
    roomMessagesRepositoryMock = {
      save: jest.fn(),
      query: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
        {
          provide: getRepositoryToken(UserRoom),
          useValue: userRoomRepositoryMock,
        },
        {
          provide: getRepositoryToken(UserRoomSessions),
          useValue: userRoomSessionRepositoryMock,
        },
        {
          provide: getRepositoryToken(RoomMessages),
          useValue: roomMessagesRepositoryMock,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  describe('createUser', () => {
    it('should create a user and return it', async () => {
      const mockUser = new User();
      userRepositoryMock.save.mockResolvedValue(mockUser);

      const result = await usersService.createUser('Amir', 'amir.hussain@10pearls.com', '123');

      expect(result).toEqual(mockUser);
      expect(userRepositoryMock.save).toHaveBeenCalledWith(expect.any(User));
    });

    it('should throw an exception if name or email is missing', async () => {
      await expect(usersService.createUser('', 'amir.hussain@10pearls.com', '123')).rejects.toThrow();
      await expect(usersService.createUser('Amir Hussain', '', 'password')).rejects.toThrow();
    });
  });

});
