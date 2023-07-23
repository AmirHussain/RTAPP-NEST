import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { UserRoom } from '../entities/user-room.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Get('rooms')
    async getAllRooms(): Promise<UserRoom[]> {
        return this.userService.findAllRooms();
    }

    
    @UseGuards(AuthGuard)
    @Get('profile:id')
    async user(@Param('id') id): Promise<User> {
        return this.userService.getUser(id);
    }
    
    @Get('roomUsers/:name')
    async getUsersInRoom(@Param('name') name): Promise<User[]> {
        return this.userService.getUsersInRoom(name);
    }
    @Get('roomMessages/:room')
    async getRoomMessages(@Param('room') room): Promise<User[]> {
        return this.userService.getRoomMessages(room);
    }

    

    @UseGuards(AuthGuard)
    @Get('userRooms')
    async userRooms(@Req() req:any): Promise<UserRoom[]> {
        return this.userService.getUserRooms(req.user.id)
    }
    
    @UseGuards(AuthGuard)
    @Post('createRoom')
    async createRoom(@Req() req:any): Promise<UserRoom> {
        return this.userService.createRoom(req.user.id,req.body.room)
    }
    
    
}
