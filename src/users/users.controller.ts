import {BadRequestException, Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {UsersService} from "./users.service";
import {User} from "../auth/user.entity";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async getAll(): Promise<any> {
        const users = await this.usersService.findAll();
        return users.map((user) => User.getReturnable(user));
    }

    @Get(':userid')
    async getOne(@Param() params): Promise<any> {
        const user = await this.usersService.findOne({where: {id: params.userid}});
        return User.getReturnable(user);
    }

    @Post()
    async create(@Body() body): Promise<any> {
        try {
            await this.usersService.add({
                username: body.username,
                password: body.password
            });
        } catch (e) {
            throw new BadRequestException("User already exists")
        }
        return {message: "User created"};
    }

    @Post(':userid')
    async update(@Param() params, @Body() body): Promise<any> {
        const user = await this.usersService.findOne({where: {id: params.userid}});

        await this.usersService.update(user.id, body);
        return {message: "User updated"};
    }

    @Delete(':userid')
    async delete(@Param() params): Promise<any> {
        const user = await this.usersService.findOne({where: {id: params.userid}});

        await this.usersService.remove(user);
        return {message: "User deleted"};
    }
}
