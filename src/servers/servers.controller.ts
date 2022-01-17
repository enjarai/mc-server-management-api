import {BadRequestException, Body, Controller, Inject, Param, Post} from "@nestjs/common";
import {Rcon} from "rcon-client";
import {ServersService} from "./servers.service";

@Controller('servers')
export class ServersController {
    constructor(@Inject("RCON_CONNECTIONS") private readonly rcon: Rcon[],
                private readonly serversService: ServersService) {}

    @Post(':server')
    async sendCommand(@Body() body, @Param() params): Promise<any> {
        await this.serversService.getServerProperties(params.server);
        let response;
        try {
            if (body.command) {
                response = {response: await this.rcon[params.server].send(body.command)};
            } else if (body.commands) {
                response = {responses: []};
                for (let command of body.commands) {
                    response.responses.push(await this.rcon[params.server].send(command));
                }
            }
        } catch (e) {
            throw new BadRequestException("Incorrect format")
        }
        return response;
    }
}