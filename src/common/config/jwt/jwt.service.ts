import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';

export type JwtPayload = {
    id: number;
    role: UserRole;
    companyId: number;
};

@Injectable()
export class JwtServices {
    constructor(
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
    ) {}

    generateAccessToken(payload: JwtPayload): Promise<string> {
        const secret = this.config.get<string>('JWT_ACCESS_TOKEN_SECRET', 'access_secret');
        const expiresIn = this.config.get('JWT_ACCESS_TOKEN_EXPIRES_IN', '100d') as any;
        return this.jwt.signAsync(payload, { secret, expiresIn });
    }

    generateRefreshToken(payload: JwtPayload): Promise<string> {
        const secret = this.config.get<string>('JWT_REFRESH_TOKEN_SECRET', 'refresh_secret');
        const expiresIn = this.config.get('JWT_REFRESH_TOKEN_EXPIRES_IN', '365d') as any;
        return this.jwt.signAsync(payload, { secret, expiresIn });
    }
}
