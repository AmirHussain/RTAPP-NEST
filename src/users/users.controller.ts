import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../users/user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Get()
    async getAllUsers(): Promise<User[]> {
        return this.userService.findAllUsers();
    }

    @Post()
    async createUser(@Body('name') name: string, @Body('room') room: string, @Body('id') id: string): Promise<User> {
        return this.userService.createUser(name, room, id);
    }

    @Get(':id')
    async user(@Param('id') id): Promise<User> {
        return this.userService.getUser(id);
    }
    
    @Get('room/:id')
    async getUsersInRoom(@Param('id') id): Promise<User[]> {
        return this.userService.getUsersInRoom(id);
    }
}
