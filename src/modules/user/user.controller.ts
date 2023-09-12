import { Controller, HttpCode, Param, Post, UseGuard } from "@core/application";
import { UserService } from "./user.service";
import { AdminGuard, AuthenticateGuard } from "@common/guard";

@Controller("v1/users")
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Post("/:id/make-admin")
    @HttpCode(200)
    @UseGuard(AdminGuard)
    @UseGuard(AuthenticateGuard)
    async makeAnUserAdmin(
        @Param("id") id: string
    ) {
        return this.userService.makeAnUserAdmin(id);
    }
}