import {Injectable, Logger} from '@nestjs/common';
import {User} from "../auth/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
    private readonly logger = new Logger("UsersService");

    constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {
        this.isEmpty().then((empty) => {
            if (empty) {
                this.add({
                    username: "admin",
                    password: "admin"
                })
                this.logger.log("No users present, adding default user: admin")
            }
        })
    }


    async add(data: any): Promise<User> {
        data.password = await bcrypt.hash(data.password, 10);
        return this.usersRepository.save(data);
    }

    async findOne(options: any): Promise<User> {
        return this.usersRepository.findOne(options);
    }

    async remove(options: any): Promise<User[]> {
        return await this.usersRepository.remove(options);
    }

    async isEmpty(): Promise<boolean> {
        return await this.usersRepository.findOne() == null;
    }
}
