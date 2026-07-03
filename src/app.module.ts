import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './common/Database/prisma.module';
import { JwtModules } from './common/config/jwt/jwt.module';
import { CoreModule } from './common/core/core.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({ global: true }),
        PrismaModule,
        JwtModules,
        CoreModule
    ],
})
export class AppModule {}
