import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly config: ConfigService) {
        super({
            jwtFromRequest: JwtStrategy.getJwt,
            ignoreExpiration: false,
            secretOrKey: config.get<string>("jwtsecret"),
        });
    }

    static getJwt(req) {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies['jwt'];
        }
        return token;
    }

    async validate(payload: any) {
        return { id: payload.sub, username: payload.username };
    }
}
