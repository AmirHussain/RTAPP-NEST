import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../users/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async createUser(name: string, room: string, id: string): Promise<User> {
        name = name.trim().toLowerCase()

        room = room.trim().toLowerCase()
        if (!name || !room) {
            throw new HttpException({
                status: HttpStatus.CONFLICT,
                error: 'User name and room are required',
            }, HttpStatus.CONFLICT, {
                cause: 'User name and room are required'
            })
        }
        const users = await this.findAllUsers()
        const existingUser = users.find(user => user.room === room && user.name === name);
        if (existingUser) {
            throw new HttpException({
                status: HttpStatus.CONFLICT,
                error: 'User name is in use',
            }, HttpStatus.CONFLICT, {
                cause: 'User name is in use'
            })
        }


        const user = new User();
        user.name = name;
        user.room = room;
        user.id = id;
        user.initials = this.getUserInitials(name);
        return await this.userRepository.save(user);
    }

    async findAllUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async getUser(id): Promise<User> {
        return await this.userRepository.findOne({ where: { id } });

    }

    async getUsersInRoom(room): Promise<User[]> {
        return await this.userRepository.find({ where: { room } });

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

        return initials.join()
    }
}
