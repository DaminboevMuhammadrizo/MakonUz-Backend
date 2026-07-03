import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './common/Database/prisma.module';
import { JwtModules } from './common/config/jwt/jwt.module';
import { CoreModule } from './common/core/core.module';
import { UserModule } from './modules/user/user.module';
import { PlaceCategoryModule } from './modules/place-category/place-category.module';
import { PlaceModule } from './modules/place/place.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({ global: true }),
        PrismaModule,
        JwtModules,
        CoreModule,
        UserModule,
        PlaceCategoryModule,
        PlaceModule
    ],
})
export class AppModule {}
