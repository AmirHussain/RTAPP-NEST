import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from './auth.guard';
import { SignInDto } from './auth.interface';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}
    @Public()
    @Post('signIn')
    async signIn(@Body() usersDto: SignInDto, @Res({ passthrough: true }) res: Response): Promise<void> {
        const result = await this.authService.signIn(usersDto.username,usersDto.password);
        res.cookie('user_details', result, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
        });
        res.cookie('access_token', result.access_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
        }).send(result);
    }
    
    @Public()
    @Post('signUp')
    async signUp(
    @Body('username') username,
    @Body('email') email,
    @Body('password') password,@Res({ passthrough: true }) res: Response): Promise<void> {
        const result= await this.authService.signUp(username,email,password);
        res.cookie('user_details', result, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
        });
        res.cookie('access_token', result.access_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
        }).send(result);
    }
}
