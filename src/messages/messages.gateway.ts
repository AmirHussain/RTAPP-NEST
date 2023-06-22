import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
    ConnectedSocket
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsersService } from '../users/users.service';
import { Socket, Server } from 'socket.io';
import moment from 'moment';

@WebSocketGateway({
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
    },
})
export class MessagesGateway {
    // constructor(private userService: UsersService) {

    // }
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('connection')
    connection(@MessageBody() data: any): Observable<WsResponse<number>> {
        console.log('connected')
        return from([1, 2, 3]).pipe(map(item => ({ event: 'messages', data: item })));
    }

    @SubscribeMessage('join')
    async join(@ConnectedSocket() socket: Socket,@MessageBody() {name,room}) {
        const user = {name,room,id:socket.id};
        if (!user) {
            return null
        }
        console.log(user.id, user)
        socket.join(user.room);

        socket.to(user.room).emit('clientMessage', { ...user, ...this.generateMessage('Welcome to sever') });
        socket.broadcast.to(user.room).emit('clientMessage', { ...user, ...this.generateMessage(user.name + ' joined the ' + user.room) });
        this.server.to(user.room).emit('roomData', { room: user.room, users: []});
        return user
    }

    @SubscribeMessage('clientMessage')
    clientMessage(@MessageBody() data: any) {
        console.log('server', 'message from client', data);
        // const filter = new Filter()
        // if (filter.isProfane(message)) {
        //   return callback('bad-words');
        // }
        console.log('server','clientMessage',data)
        if(data){
          this.server.to(data.room).emit('clientMessage',{...data ,...this.generateMessage(data.text)})
          console.log('message')
          return ('success');
      
        }
        return '';
    }

    @SubscribeMessage('identity')
    async identity(@MessageBody() data: number): Promise<number> {
        return data;
    }


    generateMessage(text) {
        return {
            text,
            createdAt: new Date().getTime()
        }
    }
    generateLocationMessage(message) {
        return {
            url: `https://google.com/maps?q=${message.lat},${message.long}`,
            createdAt: new Date().getTime()
        }
    }

}
