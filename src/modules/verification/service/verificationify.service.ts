import { Injectable } from "@core/application";
import { Exception } from "@core/consts";
import { ForbiddenException, UnauthorizedException } from "@core/exceptions";
import { IUser } from "@modules/user/schema/user.schema";
import { UserService } from "@modules/user/user.service";

@Injectable()
export class VerificationifyService {
    constructor(readonly userService: UserService) { }

    /**
     * Fetches a user by email. If not found then throws an exception
     * @throws { UnauthorizedException }
     */
    async checkAndGetUserByEmail(email: string) {
        const user = await this.userService.getOneByEmail(email);

        if (!user) {
            throw new UnauthorizedException(Exception.UnauthorizedException.INCORRECT_CREDENTIALS);
        }

        return user;
    }

    /**
     * Check whether the user account is in a verifiable state.
     * @throws { ForbiddenException }
     */
    checkEmailVerificationStatus(user: PartialPartial<IUser, "password">) {
        if (!user.email_verified_at) {
            return true;
        }

        throw new ForbiddenException(Exception.ForbiddenException.ALREADY_IN_DESIRED_STATE);
    }
}