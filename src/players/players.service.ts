import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Player} from './player.interface';
import {readFileSync} from "fs";
import {join} from "path";
import {Rcon} from "rcon-client";
import {ServersService} from "../servers/servers.service";

@Injectable()
export class PlayersService {
    constructor(@Inject("RCON_CONNECTIONS") private readonly rcon: Rcon[],
                private readonly serversService: ServersService) {}

    async getPlayersOnServer(server: string): Promise<string[]> {
        const unparsed = await this.rcon[server].send("list");
        return unparsed.split(": ")[1].split(", ");
    }

    async getAllPlayers(server: string): Promise<Player[]> {
        const serverProperties = await this.serversService.getServerProperties(server);
        const online = await this.getPlayersOnServer(server);
        let json = JSON.parse(readFileSync(join(serverProperties.path, "usercache.json"), 'utf-8'));
        json = json.map(i => {
            delete i.expiresOn;
            i.online = online.includes(i.name);
            return i;
        });
        return json;
    }

    async getPlayer(lookup: string, server: string): Promise<Player> {
        const all = await this.getAllPlayers(server);
        const result = all.find((player) => player.uuid === lookup || player.name === lookup);
        if (!result) throw new NotFoundException("No such player on that server");
        return result;
    }

    async getPlayerStats(server: string, player: Player) {
        const serverProperties = await this.serversService.getServerProperties(server);
        return JSON.parse(readFileSync(
            join(serverProperties.path, "world/stats", player.uuid + ".json"), 'utf8')).stats;
    }
}
