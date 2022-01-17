import {Controller, Get, Param, Req} from '@nestjs/common';
import {PlayersService} from "./players.service";
import {Player} from "./player.interface";

@Controller('players')
export class PlayersController {
    constructor(private readonly playersService: PlayersService) {}

    @Get(':server')
    async getAllPlayers(@Req() request, @Param() params): Promise<Player[]> {
        return this.playersService.getAllPlayers(params.server);
    }

    @Get(':server/:lookup')
    async getPlayer(@Req() request, @Param() params): Promise<Player> {
        return this.playersService.getPlayer(params.lookup, params.server);
    }

    @Get(':server/:lookup/stats')
    async getPlayerStats(@Req() request, @Param() params): Promise<any> {
        const player = await this.playersService.getPlayer(params.lookup, params.server);
        return this.playersService.getPlayerStats(params.server, player);
    }
}
