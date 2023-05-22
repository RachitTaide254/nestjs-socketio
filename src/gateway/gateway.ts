import {
  CanActivate,
  Injectable,
  OnModuleInit,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket, Namespace } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
// import { WsAuthGuard } from 'src/auth/ws-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import * as Jwt from 'jsonwebtoken';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from 'src/admin/admin.model';
import { Blog } from 'src/blogs/blog.model';

@WebSocketGateway({
  namespace: 'events',
})
//@Injectable({})
export class EventsGetway implements OnModuleInit {
  constructor(
    private jwt: JwtService,
    @InjectModel('admin') private readonly adminModel: Model<Admin>,
    @InjectModel('blog') private readonly blogModel: Model<Blog>,
  ) {}
  @WebSocketServer()
  server: Server;
  //console.log(server,'sss')

  onModuleInit() {
    this.server.on('connection', async (socket: Socket) => {
      var token = socket.handshake.query.token.toString();
      var decode = this.jwt.verify(token, { secret: 'super-duper-secret' });
      const { id, email } = decode;
      const adminUser = await this.adminModel.findOne({ email: email });
      if (!adminUser) {
        socket.disconnect();
      }
      socket.handshake.query.user_id = id;
    });
  }

  //Socket for 1 to 1 messaging
  @SubscribeMessage('Msg')
  handleEvent(client: any, payload: any): void {
    //console.log(payload);
    this.server.emit('Msg', payload);
  }

  //Socket for creating blog
  @SubscribeMessage('createBlog')
  handleEventCreate(client: any, payload: any): void {
    const newBlog = new this.blogModel(payload);
    newBlog.createdBy = client.handshake.query.user_id;
    newBlog.save();
    this.server.emit('createBlog', newBlog);
  }

  //Socket for viewing all blogs
  @SubscribeMessage('viewBlog')
  async ViewBlog(client: any, payload: any): Promise<any> {
    var pageNumber = (payload.pageData - 1) * payload.limitdata;
    const blog = await this.blogModel
      .find({})
      .sort({ _id: -1 })
      .skip(pageNumber)
      .limit(payload.limitdata); 
    this.server.emit('viewBlog', blog);
  }
}
