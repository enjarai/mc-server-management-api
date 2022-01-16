import {BadRequestException, Body, Controller, Post, Req, Res, UseGuards} from '@nestjs/common';
import {UsersService} from "./users.service";
import {AuthService} from "../auth/auth.service";
import {LocalAuthGuard} from "../auth/local.guard";
import {Public} from "../auth/auth.decorator";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService,
                private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() body): Promise<any> {
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

    @Post('login')
    @Public()
    @UseGuards(LocalAuthGuard)
    async login(@Body() body, @Res({passthrough: true}) response, @Req() request): Promise<any> {
        response.cookie("jwt", await this.authService.login(request.user), {httpOnly: true});
        return request.user;
    }
}
