import {Injectable} from '@nestjs/common';
import {User} from "../auth/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

    async add(data: any): Promise<User> {
        data.password = await bcrypt.hash(data.password, 10);
        return this.usersRepository.save(data);
    }

    async findOne(options: any): Promise<User> {
        return this.usersRepository.findOne(options);
    }
}
