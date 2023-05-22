import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Session,
  Type,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Admin } from 'src/admin/admin.model';
//import session from 'express-session';
import { Blog } from 'src/blogs/blog.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as Jwt from 'jsonwebtoken';
import { AuthGuard } from '@nestjs/passport';
import { Request } from "express";
import { AuthenticatedGuard, LocalAuthGuard } from './local-auth.guard';
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('admin/signup')
  async admin_signup(@Body() adminDto: Admin) {
    return this.authService.admin_signup(adminDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('admin/login')
  async admin_login(@Body() adminDto: Admin,@Req() req) {
    return this.authService.admin_login(adminDto);
  }

  @UseGuards(AuthGuard('jwt')) 
  @Post('user/createBlog')
  async createBlog(@Body() dto: Blog,@Req() req:Request) {
    return this.authService.createBlog(dto,req.user);
  }

  @UseGuards(AuthGuard('jwt')) 
  @Get('user/blog/:id')
  async viewBlog(@Param('id') id: Blog,@Req() req:Request) {
    var data ={
      id:id,
      user:req.user
    }
    return this.authService.viewBlog(data);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt')) 
  @Delete('user/blog/:id')
  async deleteBlog(@Param('id') id: Blog,@Req() req:Request) {
    var data ={
      id:id,
      user:req.user
    }
    return this.authService.deleteBlog(data);
  }

  @UseGuards(AuthGuard('jwt')) 
  @Get('user/blogs/:page/:limit')
  async allBlog(@Param('page') page:number, @Param('limit') limit:number, @Req() req:Request) {
    return this.authService.allBlog(page,limit);
  }

  @UseGuards(AuthGuard('jwt')) 
  @Put('user/editblog')
  async editBlog(@Body() dto: Blog,@Req() req:Request) {
    return this.authService.editBlog(dto,req.user);
  }

}
