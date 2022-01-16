import {Logger, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayersService } from './players/players.service';
import { PlayersController } from "./players/players.controller";
import {ServerProperties} from "./config/server.interface";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {configuration, JSON_CONFIG_FILENAME} from "./config/configuration";
import {Rcon} from "rcon-client";
import {ServersService} from "./servers/servers.service";
import {JwtAuthGuard} from "./auth/auth.guard";
import {APP_GUARD} from "@nestjs/core";
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {readFileSync} from "fs";
import {join} from "path";
import {UsersController} from "./users/users.controller";
import {UsersService} from "./users/users.service";
import {User} from "./auth/user.entity";
import {PassportModule} from "@nestjs/passport";
import {AuthService} from "./auth/auth.service";
import {JwtStrategy} from "./auth/jwt.strategy";
import {LocalStrategy} from "./auth/local.strategy";

const logger = new Logger("Startup");

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [configuration]
      }),
      TypeOrmModule.forRoot(),
      TypeOrmModule.forFeature([User]),
      JwtModule.register({
        secret: JSON.parse(readFileSync(join(JSON_CONFIG_FILENAME), 'utf8')).jwtsecret,
        signOptions: {expiresIn: "1h"}
      }),
      PassportModule
  ],
  controllers: [
      AppController,
      PlayersController,
      UsersController
  ],
  providers: [
      AppService,
      PlayersService,
      ServersService,
      UsersService,
      AuthService,
      LocalStrategy,
      JwtStrategy,
      {
          provide: 'RCON_CONNECTIONS',
          useFactory: async (config: ConfigService) => {
              const servers = config.get<ServerProperties[]>("servers");
              const connections = [];
              for (const k of Object.keys(servers)) {
                  const v = servers[k];
                  if (v.rcon) {
                      try {
                          connections[k] = await Rcon.connect(v.rcon)
                      } catch (e) {
                          logger.log("Failed to connect to rcon for server " + k + ": " + e.message)
                          process.exit(1)
                      }
                  }
              }
              logger.log("Rcon connections established")
              return connections;
          },
          inject: [ConfigService]
      },
      {
          provide: APP_GUARD,
          useClass: JwtAuthGuard
      }
  ],
})
export class AppModule {}
