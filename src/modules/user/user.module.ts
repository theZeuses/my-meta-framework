import { Module } from "@core/application";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { UserController } from "./user.controller";
import { AdminGuard, AuthenticateGuard } from "@common/guard";

@Module({
    providers: [
        UserService,
        UserRepository,
        AdminGuard,
        AuthenticateGuard
    ],
    controllers: [
        UserController
    ]
})
export class UserModule {}