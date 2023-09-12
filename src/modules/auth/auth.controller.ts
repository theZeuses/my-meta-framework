import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuard, ValidateBody } from "@core/application";
import { AuthService } from "@modules/auth/auth.service";
import { Request } from 'express';
import { LoginDto, RegisterDto, VerifyEmailDto, loginSchema, registerSchema, verifyEmailSchema } from "./dto";
import { RefreshToken } from "./interfaces";
import { CookieService } from "./services";
import { RefreshFingerprintGuard, RefreshJwtGuard } from "./guard";
import { ZodValidationPipe } from "@common/pipe/zod-validation.pipe";

@Controller("v1/auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly cookieService: CookieService
    ) {
    }

    @Post("/login")
    @HttpCode(200)
    @ValidateBody(new ZodValidationPipe(loginSchema))
    async login(
        @Body() body: LoginDto,
        @Req() req: Request,
    ) {
        const { payload, fingerprint } = await this.authService.signIn(body, req.headers['user-agent']);

        this.cookieService.attachSessionFingerprint(new Date(payload.auth.refresh.expires_at), fingerprint, req);
        return payload;
    }

    @Post("/register")
    @HttpCode(201)
    @ValidateBody(new ZodValidationPipe(registerSchema))
    async register(
        @Body() body: RegisterDto
    ) {
        return this.authService.register(body);
    }

    @Post("/refresh-token")
    @HttpCode(200)
    @UseGuard(RefreshFingerprintGuard)
    @UseGuard(RefreshJwtGuard)
    async refreshToken(
        @Req() req: Request
    ) {
        const { payload, fingerprint } = await this.authService.refreshToken(req.userWhileRefreshToken as RefreshToken);

        this.cookieService.attachSessionFingerprint(new Date(payload.auth.refresh.expires_at), fingerprint, req);
        return payload;
    }

    @Post("/verify-email")
    @HttpCode(200)
    @ValidateBody(new ZodValidationPipe(verifyEmailSchema))
    async verifyEmail(
        @Body() body: VerifyEmailDto,
        @Req() req: Request
    ) {
        const { payload, fingerprint } = await this.authService.verifyEmail(body.verification_id, body.code, req.headers['user-agent']);

        this.cookieService.attachSessionFingerprint(new Date(payload.auth.refresh.expires_at), fingerprint, req);
        return payload;
    }

    @Post("/logout")
    @HttpCode(200)
    @UseGuard(RefreshJwtGuard)
    async logout(
        @Req() req: Request
    ) {
        const refreshToken = req.userWhileRefreshToken as RefreshToken;
        const payload = this.authService.logoutUser(refreshToken.user_id, refreshToken.role, refreshToken.session);

        this.cookieService.clearSessionFingerprint(req);
        return payload;
    }
}