import { Module } from '@nestjs/common';
import { EventsGetway, } from './gateway';
import { AuthService } from 'src/auth/auth.service';
import { AdminModule } from 'src/admin/admin.module';
import { Admin, AdminSchema } from 'src/admin/admin.model';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogSchema } from 'src/blogs/blog.model';

@Module({
    imports:[JwtModule.register({}),
        MongooseModule.forFeature([{ name: 'admin', schema: AdminSchema }]),
        MongooseModule.forFeature([{ name: 'blog', schema: BlogSchema }]),
    ],
    providers:[EventsGetway],
    exports:[EventsGetway]
})
export class GetwayModule {}
