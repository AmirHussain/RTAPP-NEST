import { HttpException, Injectable, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService,
        
    private jwtService: JwtService) { }

    async signIn(username: string, pass: string): Promise<any> {
        const user = await this.usersService.loginUser(username);
        if (user?.password !== pass) {
            throw new UnauthorizedException();
        }
        const { password, ...result } = user;
        // TODO: Generate a JWT and return it here
        // instead of the user object

        return {...result,... await this.getAccessToken(user)};
    }
    

    async signUp(username: string, email: string, pass: string): Promise<any> {
        if (email) {
            email = email.toLowerCase().trim()
            const userExists = await this.usersService.checkUserExists(email);
            if (userExists) {
                throw new HttpException(`${email} already registered`, HttpStatus.NOT_ACCEPTABLE)
            } else {
                const result = await this.usersService.createUser(username, email, pass);
                return {...result,... await this.getAccessToken(result)};
            }


        } else {
            throw new HttpException(`Please specify email`, HttpStatus.NOT_ACCEPTABLE)
        }
        // TODO: Generate a JWT and return it here
        // instead of the user object

    }

   async getAccessToken(user:User){
        const payload = { name: user.name, email: user.email ,id:user.id};
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
    }
}
