import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserRoom } from '../entities/user-room.entity';

import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoomSessions } from '../entities/user-room-sessions.entity';
import { RoomMessages } from '../entities/room-messages.entity';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserRoom)
        private readonly userRoomRepository: Repository<UserRoom>,
        @InjectRepository(UserRoomSessions)
        private readonly UserRoomSessionRepository: Repository<UserRoomSessions>,
        @InjectRepository(RoomMessages)
        private readonly RoomMessagesRepository: Repository<RoomMessages>,
    ) { }

    async createUser(name: string, email: string, pass: string): Promise<User> {
        name = name.trim().toLowerCase()

        email = email.trim().toLowerCase()
        if (!name || !email) {
            throw new HttpException({
                status: HttpStatus.CONFLICT,
                error: 'User name and room are required',
            }, HttpStatus.CONFLICT, {
                cause: 'User name and room are required'
            })
        }

        const user = new User();
        user.name = name;
        // user.room = room;
        user.initials = this.getUserInitials(name);

        user.email = email;
        user.password = pass;
        return await this.userRepository.save(user);
    }
    async checkUserExists(email: string): Promise<boolean> {
        return await this.userRepository.exist({ where: { email } });
    }

    async findAllOtherRooms(userId: number): Promise<UserRoom[]> {
        return await this.userRoomRepository.query(`select * from user_room where user_id!=${userId}`);
    }

    async findAllRooms(): Promise<UserRoom[]> {
        return await this.userRoomRepository.find();
    }


    async getUserRooms(user_id: number): Promise<UserRoom[]> {
        return await this.userRoomRepository.findBy({ user_id });
    }


    async getUser(id): Promise<User> {
        return await this.userRepository.findOne({ where: { id } });
    }

    async loginUser(username: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { name: username } });
    }

    async getRoomMessages(room_id: number): Promise<any> {
        const query = `select usr.id,
        usr.name as "user",
        usr.id as "user_id",
        usr.initials,
        msg.date_created as "createdAt", 
        msg.message,
        msg.type from public.room_messages as msg 
        inner join public.user_room_sessions as  urs on urs.user_session_id=msg.user_socket_id
        inner join public.user as usr on urs.user_id=usr.id 
        where urs.room_id=${room_id}`
        const result: Promise<User[]> = await this.userRepository.query(query);
        return result;
    }

    async getUsersInRoom(room:number): Promise<User[]> {

        const result: Promise<User[]> = await this.userRepository.query(`Select usr.id,usr.name,usr.email from public.user as usr inner join public.user_room as ur
        on usr.id=ur.user_id where ur.id=${room}`)
        return result;
    }

    async createRoom(user_id: number, room) {
        return this.userRoomRepository.save({ user_id, room });
    }

    async addUserSession(room_id: number, user_id: number, socket_id: string) {
        return this.UserRoomSessionRepository.save({
            user_id, room_id, user_session_id: socket_id,
            date_created: new Date()
        });
    }
    async addUserMessage( socket_id: string, message: string,type:string) {
        return this.RoomMessagesRepository.save({
            user_socket_id: socket_id, message,
            type,
            date_created: new Date()
        }); 
    }


    async removeUser(id): Promise<DeleteResult> {
        return await this.userRepository.delete({ id });
    }

    getUserInitials(name): string {
        let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

        let initials = [...name.matchAll(rgx)] || [];

        initials = (
            (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
        ).toUpperCase();

        return Array.isArray(initials) ? initials.join() : initials;
    }
}
