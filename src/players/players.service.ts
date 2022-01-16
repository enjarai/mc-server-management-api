import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Player} from './player.interface';
import {readFileSync} from "fs";
import {ServerProperties} from "../config/server.interface";
import {join} from "path";
import {Rcon} from "rcon-client";

@Injectable()
export class PlayersService {
    constructor(@Inject("RCON_CONNECTIONS") private readonly rcon: Rcon[]) {}

    async getPlayersOnServer(server: string): Promise<string[]> {
        const unparsed = await this.rcon[server].send("list");
        return unparsed.split(": ")[1].split(", ");
    }

    async getAllPlayers(server: string, serverProperties: ServerProperties): Promise<Player[]> {
        const online = await this.getPlayersOnServer(server);
        let json = JSON.parse(readFileSync(join(serverProperties.path, "usercache.json"), 'utf-8'));
        json = json.map(i => {
            delete i.expiresOn;
            i.online = online.includes(i.name);
            return i;
        });
        return json;
    }

    async getPlayer(lookup: string, server: string, serverProperties: ServerProperties): Promise<Player> {
        const all = await this.getAllPlayers(server, serverProperties);
        const result = all.find((player) => player.uuid === lookup || player.name === lookup);
        if (!result) throw new NotFoundException("No such player on that server");
        return result;
    }
}
