import {Injectable, NotFoundException} from '@nestjs/common';
import {ServerProperties} from "../config/server.interface";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class ServersService {
    constructor(private readonly config: ConfigService) {}

    async getServerProperties(server: string): Promise<ServerProperties> {
        const serverProperties = this.config.get<ServerProperties[]>("servers")[server];
        if (!serverProperties) throw new NotFoundException("Invalid server");
        return serverProperties;
    }
}
