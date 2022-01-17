import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from "bcrypt";
import {JwtService} from "@nestjs/jwt";
import {User} from "./user.entity";

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService,
                private readonly jwtService: JwtService) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne({where: {username: username}});
        if (user && await bcrypt.compare(pass, user.password)) {
            return User.getReturnable(user);
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        return this.jwtService.sign(payload);
    }
}