import { CacheModule, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { GetwayModule } from './gateway/gateway.module';


@Module({
  imports: [ConfigModule.forRoot({}),AuthModule, UserModule,GetwayModule, AdminModule],
})

export class AppModule {}
