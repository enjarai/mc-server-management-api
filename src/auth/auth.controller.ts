import {Body, Controller, Post, Req, Res, UseGuards} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {AuthService} from "./auth.service";
import {LocalAuthGuard} from "./local.guard";
import {Public} from "./auth.decorator";

@Controller('auth')
export class AuthController {
    constructor(private readonly usersService: UsersService,
                private readonly authService: AuthService) {}

    @Post('login')
    @Public()
    @UseGuards(LocalAuthGuard)
    async login(@Body() body, @Res({passthrough: true}) response, @Req() request): Promise<any> {
        response.cookie("jwt", await this.authService.login(request.user), {httpOnly: true});
        return request.user;
    }
}
