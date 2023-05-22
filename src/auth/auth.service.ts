import { CACHE_MANAGER, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Admin, AdminDocument } from '../admin/admin.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Blog } from 'src/blogs/blog.model';
import * as Jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { EventsGetway } from 'src/gateway/gateway';
import { Cache } from "cache-manager";

@Injectable({})
export class AuthService {
  constructor(
    @InjectModel('admin') private readonly adminModel: Model<Admin>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectModel('blog') private readonly blogModel: Model<Blog>,
    private eventGateway: EventsGetway, 
    private jwt: JwtService,
  ) {}

  //Admin signup API using email and password
  async admin_signup(admin: Admin): Promise<Admin> {
    try {
      const adminExist = await this.adminModel.findOne({ email: admin.email });
      if (adminExist == null) {
        const newUser = new this.adminModel(admin);
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(admin.password, salt);
        return newUser.save();
      } else {
        throw new ForbiddenException('Credentials taken');
      }
    } catch (e) {
      //console.log(e,'err in admin signup')
      return e.response;
    }
  }

  //Admin Login API using email and password and token generated.
  async admin_login(admin: Admin): Promise<Admin> {
    try {
      const adminUser = await this.adminModel.findOne({ email: admin.email });
      let validPassword = await bcrypt.compare(
        admin.password,
        adminUser.password, 
      );
      if (validPassword) {
        var token = await this.signToken(admin.email, adminUser.id);
        return token;
      } else {
        throw new ForbiddenException('Credentials incorrect');
      }
    } catch (e) {
      //console.log(e,'err in admin login')
      return e.response;
    }
  }

  // async admin_exist(admin: Admin): Promise<Admin> {
  //   try {
  //     const adminUser = await this.adminModel.findOne({ email: admin.email });
  //     if (adminUser) {
  //       return adminUser;
  //     } else {
  //       throw new ForbiddenException('Credentials incorrect');
  //     }
  //   } catch (e) {
  //     return e.response;
  //   }
  // }

  //Create blog API 
  async createBlog(blog: Blog, user: any): Promise<Blog> {
    try {
      const newBlog = new this.blogModel(blog);
      newBlog.createdBy = user.id;
      return newBlog.save();
    } catch (e) {
      return e.response;
    }
  }
 
  //View single blog API using blog Id
  async viewBlog(data: any): Promise<Blog> {
    try {
      const blog = await this.blogModel.findOne({ _id: data.id });
      if (blog.createdBy === data.user.id) {
        return blog;
      } else {
        throw new ForbiddenException('Unauthorized');
      }
    } catch (e) {
      return e.response;
    }
  }

  //Delete single blog API using blog Id
  async deleteBlog(data: any): Promise<Blog> {
    try {
      const blog = await this.blogModel.findOne({ _id: data.id });
      if (blog.createdBy === data.user.id) {
        await this.blogModel.findOneAndDelete({
          _id: data.id,
        });
      } else {
        throw new ForbiddenException('Unauthorized');
      }
    } catch (e) {
      return e.response;
    }
  }

  //View all blog API using page number and limit 
  //Redis used for caching 
  async allBlog(pageData: number, limitdata: number): Promise<any> {
    try {
      const val = await this.cacheManager.get('blog')
      if(val){
        return val
      }else{
        var pageNumber = (pageData - 1) * limitdata;
      const blog = await this.blogModel
        .find({})
        .sort({ _id: -1 })
        .skip(pageNumber)
        .limit(limitdata);
        await this.cacheManager.set('blog',blog,15000)
        return blog;
      }
    } catch (e) {
      return e.response;
    }
  }

  //Edit blog API using blog Id
  async editBlog(data: any, userData: any): Promise<Blog> {
    try {
      const blog = await this.blogModel.findOne({ _id: data.id });
      if (blog == null) {
        throw new ForbiddenException('Blog does not exist');
      } else {
        if (blog.createdBy === userData.id) {
          const blog = await this.blogModel.findOneAndUpdate(
            { _id: data.id },
            data,
            {
              new: true,
            },
          );
          return blog;
        } else {
          throw new ForbiddenException('Unauthorized');
        }
      }
    } catch (e) {
      return e.response;
    }
  }

  async signToken(email: string, id: string): Promise<any> {
    const payload = {
      email,
      id,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '60m',
      secret: 'super-duper-secret',
    });
    return {
      accessToken: token,
    };
  }

  async validate_user(email:string,password:string):Promise<any>{
    const adminUser = await this.adminModel.findOne({ email: email });
    let validPassword = await bcrypt.compare(
      password,
      adminUser.password,
    );
    if (validPassword) {
      return adminUser;
    }else{
      return 'user not found'
  }
  }
}
