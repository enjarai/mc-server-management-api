import {BadRequestException, Injectable, Logger} from '@nestjs/common';
import {User} from "../auth/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {FindOneOptions, Repository, UpdateResult} from "typeorm";
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

    private static async hash(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    async add(data: any): Promise<User> {
        data.password = await UsersService.hash(data.password);
        return this.usersRepository.save(data);
    }

    async findOne(options: FindOneOptions): Promise<User> {
        const user = await this.usersRepository.findOne(options);
        if (!user) throw new BadRequestException("User doesnt exist");
        return user;
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async update(id: number, data: any): Promise<UpdateResult> {
        delete data.id;
        if (data.password) data.password = await UsersService.hash(data.password)
        return this.usersRepository.update({id: id}, data);
    }

    async remove(options: any): Promise<User[]> {
        return await this.usersRepository.remove(options);
    }

    async isEmpty(): Promise<boolean> {
        return await this.usersRepository.findOne() == null;
    }
}
