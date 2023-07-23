import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect
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
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private userService: UsersService) {

    }
    handleConnection(client: any, ...args: any[]) {
        console.log(client)
    }
    handleDisconnect(client: any) {
        console.log(client)
    }

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('events')
    connection(@MessageBody() data: any): Observable<WsResponse<number>> {
        console.log('connected')
        return from([1, 2, 3]).pipe(map(item => ({ event: 'message', data: { ...data, ...this.generateMessage(data.name + 'conected') } })));
    }

    @SubscribeMessage('unsubscribe')
    disconnect(@ConnectedSocket() socket: Socket, @MessageBody() data: any): any {
        this.server.to(data.name).emit('message', { ...data, ...this.generateMessage(data.name + ' user has left the room ' + data.room) })

    }


    @SubscribeMessage('join')
    async join(@ConnectedSocket() socket: Socket, @MessageBody() { user, room, id }) {
     try{
        if (!user) {
            return null
        }
        console.log(user.id, user)
        socket.join(room.id);
        this.server.to(room.id).emit('clientMessage', { ...user,...room, ...this.generateMessage('Welcome to sever') });
        socket.broadcast.to(room.id).emit('clientMessage', { ...user, ...this.generateMessage(user.name + ' joined the ' + room.id) });
        // this.server.to(room.id).emit('roomData', { room: room, users: [] });
        this.userService.addUserSession(room.id,user.id,id)
        return user

     }catch(err){

     }
    }

    @SubscribeMessage('clientMessage')
    clientMessage(@MessageBody() data: any) {
        console.log('server', 'message from client', data);
        // const filter = new Filter()
        // if (filter.isProfane(message)) {
        //   return callback('bad-words');
        // }
        console.log('server', 'clientMessage', data)
        if (data) {
            const message= this.generateMessage(data.message)
            this.server.to(data.room).emit('clientMessage', { ...data,...message })
            this.userService.addUserMessage(data.id,message.text,data.type);
            return ('success');

        }
        return '';
    }

    @SubscribeMessage('location')
    locationMessage(@MessageBody() data: any) {
        console.log('server', 'message from client', data);
        // const filter = new Filter()
        // if (filter.isProfane(message)) {
        //   return callback('bad-words');
        // }
        console.log('server', 'clientMessage', data)
        if (data) {
            const message=this.generateLocationMessage(data);
            this.server.to(data.room).emit('clientMessage', { ...data, ...this.generateLocationMessage(data) })
            this.userService.addUserMessage(data.id,message.url,data.type);
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
