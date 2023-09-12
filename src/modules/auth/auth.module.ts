import { Module } from "@core/application";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "@modules/user/user.module";
import { CookieService } from "./services";
import { AuthenticateGuard } from "@common/guard";
import { RefreshFingerprintGuard, RefreshJwtGuard } from "./guard";

@Module({
    imports: [
        UserModule
    ],
    providers: [
        AuthService,
        CookieService,
        AuthenticateGuard,
        RefreshJwtGuard,
        RefreshFingerprintGuard
    ],
    controllers: [
        AuthController
    ]
})
export class AuthModule {
}