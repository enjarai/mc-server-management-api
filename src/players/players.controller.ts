import {Controller, Get, Param, Req} from '@nestjs/common';
import {PlayersService} from "./players.service";
import {Player} from "./player.interface";
import {ServersService} from "../servers/servers.service";

@Controller('players')
export class PlayersController {
    constructor(private readonly statsService: PlayersService,
                private readonly serversService: ServersService) {}

    @Get(':server')
    async getAllPlayers(@Req() request, @Param() params): Promise<Player[]> {
        return this.statsService.getAllPlayers(...await this.serversService.getServerProperties(params.server));
    }

    @Get(':server/:lookup')
    async getPlayer(@Req() request, @Param() params): Promise<Player> {
        return this.statsService.getPlayer(params.lookup,
            ...await this.serversService.getServerProperties(params.server));
    }
}
