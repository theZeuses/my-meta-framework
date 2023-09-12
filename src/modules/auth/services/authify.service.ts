import { UserService } from "@modules/user/user.service";
import { SessionService } from "./session.service";
import { TokenService } from "./token.service";
import { ArgonService, UUIDService } from "@common/services";
import { ForbiddenException, UnauthorizedException } from "@core/exceptions";
import { Exception } from "@core/consts";
import { UserDocument } from "@modules/user/schema/user.schema";
import { Injectable } from "@core/application";
import { Role } from "@common/constants";

@Injectable()
export class AuthifyService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly tokenService: TokenService,
    private readonly hashService: ArgonService,
    private readonly uuidService: UUIDService
  ) { }

  /**
   * Fetches a user by email. If not found then throws an exception
   * @throws { UnauthorizedException }
   */
  async checkAndGetUserByEmail(email: string) {
    const user = await this.userService.getOneByEmailWithPassword(email);

    if (!user)
      throw new UnauthorizedException(
        Exception.UnauthorizedException.INCORRECT_CREDENTIALS
      );
    return user;
  }

  /**
   * Fetches a user by id. If not found then throws an exception
   * @throws { ForbiddenException }
   */
  async checkAndGetUserById(id: string) {
    const user = await this.userService.getOneById(id);

    if (!user)
      throw new ForbiddenException(
        Exception.ForbiddenException.NOT_FOUND
      );
    return user;
  }

  /**
   * Validates inputted password against stored user's hashed password
   * @throws { UnauthorizedException }
   */
  async validatePassword(user: UserDocument, password: string) {
    const passwordMatches = await this.hashService.verify(
      user.password,
      password,
    );

    if (!passwordMatches)
      throw new UnauthorizedException(
        Exception.UnauthorizedException.INCORRECT_CREDENTIALS
      );
    return true;
  }

  /**
   * Validates if current profile status is in a authable state
   * @throws { ForbiddenException }
   */
  async validateStatus(user: PartialPartial<UserDocument, "password">) {
    if (user.deleted_at)
      throw new ForbiddenException(
        Exception.ForbiddenException.ACCOUNT_DELETED
      );

    if (!user.email_verified_at)
      throw new ForbiddenException(
        Exception.ForbiddenException.PENDING_PROFILE
      );

    //TODO; my have other status check against the user profile

    return true;
  }

  /**
   * Generates appropriate session, fingerprint, and auth tokens against the user
   */
  async authify(user: PartialPartial<UserDocument, "password">, userAgent?: string) {
    const sessionId = await this.sessionService.generateSession({
      user_id: user._id.toJSON(),
      role: user.role || Role.USER,
      payload: {
        agent: userAgent,
        created_at: Date.now()
      }
    });

    const fingerprint = await this.generateFingerprint();

    const result = await this.tokenService.signTokens(user, sessionId, fingerprint);

    return {
      payload: {
        auth: result.auth,
        user
      },
      fingerprint
    }
  }

  /**
   * Refreshes appropriate session, fingerprint, and auth tokens against the user
   */
  async reAuthify(user: PartialPartial<UserDocument, "password">, sessionId: string) {
    const fingerprint = await this.generateFingerprint();

    await this.sessionService.refreshSession(sessionId, {
      user_id: user._id.toString(),
      role: user.role || Role.USER
    });

    const result = await this.tokenService.signTokens(user, sessionId, fingerprint);

    return {
      payload: {
        auth: result.auth,
        user
      },
      fingerprint
    }
  }

  /**
   * Generate a random fingerprint string
   * @returns {string}
   */
  async generateFingerprint() {
    return this.uuidService.uuid();
  }
}