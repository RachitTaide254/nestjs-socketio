import { CacheModule, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from '../admin/admin.model';
import { BlogSchema } from 'src/blogs/blog.model';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { SessionSerializer } from './session.serializer';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/session.strategy';
import { ConfigModule } from '@nestjs/config';
import { GetwayModule } from 'src/gateway/gateway.module';
import {redisStore } from 'cache-manager-redis-yet';
@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({store:redisStore,
    host:'localhost',
    port:6379}), 
    MongooseModule.forRoot(
      process.env.DATABASE_URI,
    ),
    MongooseModule.forFeature([{ name: 'admin', schema: AdminSchema }]),
    MongooseModule.forFeature([{ name: 'blog', schema: BlogSchema }]),
    JwtModule.register({})
    ,
    PassportModule.register({session:true})
    ,
    GetwayModule
  ],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,JwtStrategy,SessionSerializer],
  exports:[AuthService]
})
export class AuthModule {}
