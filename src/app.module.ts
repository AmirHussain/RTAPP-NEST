import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { MessagesService } from './messages/messages.service';
import { MessagesModule } from './messages/messages.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'samtio12',
      database: 'chatapp',
      entities: [__dirname + '/**/*.entity.js'],
      synchronize: true,
    }),
    UsersModule,
    MessagesModule
  ],
  exports:[
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService, MessagesService],
})
export class AppModule {}