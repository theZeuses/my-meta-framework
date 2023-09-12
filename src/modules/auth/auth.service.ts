import { UserService } from "@modules/user/user.service";
import { LoginDto, RegisterDto } from "./dto";
import { AuthifyService, SessionService } from "./services";
import { VerificationService } from "@modules/verification/verification.service";
import { Role } from "@common/constants";
import { RefreshToken } from "./interfaces";
import { UserDocument } from "@modules/user/schema/user.schema";
import { Injectable } from "@core/application";

@Injectable()
export class AuthService {
  constructor(
    private readonly authifyService: AuthifyService,
    private readonly userService: UserService,
    private readonly verificationService: VerificationService,
    private readonly sessionService: SessionService
  ) { }

  async signIn(dto: LoginDto, userAgent?: string) {
    const user = await this.authifyService.checkAndGetUserByEmail(dto.email);

    await this.authifyService.validatePassword(user, dto.password);
    await this.authifyService.validateStatus(user);

    const userWithoutPassword = this.userService.deletePasswordFromUserDocument(user);
    return this.authifyService.authify(userWithoutPassword, userAgent);
  }

  async register(dto: RegisterDto) {
    const user = await this.userService.createOneAndFetch(dto);

    //send verification code
    const verificationCode = await this.verificationService.enqueueEmailVerificationMail(user.email, user._id.toString());

    return {
      need_email_verification: true,
      user,
      verification_code_id: verificationCode._id
    }
  }

  async verifyEmail(verification_id: string, code: string, userAgent?: string) {
    const result = await this.verificationService.verifyEmail(verification_id, code);

    //login user
    return this.authifyService.authify(result.user, userAgent);
  }

  async refreshToken(dto: RefreshToken) {
    try {
      const user = await this.authifyService.checkAndGetUserById(dto.user_id);

      await this.authifyService.validateStatus(user as PartialPartial<UserDocument, "password">);

      return this.authifyService.reAuthify(user as PartialPartial<UserDocument, "password">, dto.session);

    } catch (err) {
      //as te user is currently not in a authable state
      //invalidate the session
      await this.sessionService.deleteSession(dto.user_id, dto.role, dto.session);

      //delegate the error to be handled globally or the handler
      throw err;
    }
  }

  async logoutUser(u_id: string, user_type: valueof<typeof Role>, sessionId: string) {
    const result = await this.sessionService.deleteSession(u_id, user_type, sessionId);

    return {
      success: result === 1
    }
  }
}