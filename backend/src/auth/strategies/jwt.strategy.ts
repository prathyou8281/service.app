import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
        });
    }

    async validate(payload: any) {
        if (!payload.id || !payload.role) {
            throw new UnauthorizedException('Invalid token payload');
        }

        // Status check is handled at guard level, but ensure it exists in payload
        return {
            id: payload.id,
            role: payload.role,
            status: payload.status
        };
    }
}
