import { Injectable } from "@core/application";
import { IGuard } from "@core/application/interface";
import { ForbiddenException, UnauthorizedException } from "@core/exceptions";
import { Request, Response } from "express";
import { CookieService, JWTService, SessionService } from "../services";

@Injectable()
export class RefreshJwtGuard implements IGuard {
    constructor(
        private readonly jwtService: JWTService
    ) {}

    async canProceed(req: Request, res: Response): Promise<boolean> {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) throw new UnauthorizedException();

        const payload = this.jwtService.authenticateRefreshToken(token);
        if(!payload) throw new UnauthorizedException();
        
        req.userWhileRefreshToken = payload;

        return true;
    }
}

@Injectable()
export class RefreshFingerprintGuard implements IGuard {
    constructor(
        private readonly sessionService: SessionService,
        private readonly cookieService: CookieService
    ) {}

    async canProceed(req: Request, res: Response): Promise<boolean> {
        const { userWhileRefreshToken: user, signedCookies } = req;
        
        if (!user || !signedCookies) {
            throw new ForbiddenException();
        }

        const fingerprintFromCookie = this.cookieService.getFingerprintFromCookie(signedCookies);

        const valid = await this.sessionService.isValidSession({
            user_id: user.user_id,
            role: user.role
        }, user.session);

        if (valid) {
            if (user.fingerprint == fingerprintFromCookie) {
                return true;
            }
        }

        //as either session is not valid or fingerprint didn't match
        //this can be a forged request
        //so as a security measure the cookie and session is invalidated
        await this.sessionService.deleteSession(user.user_id, user.role, user.session);
        await this.cookieService.clearSessionFingerprint(req);
        throw new ForbiddenException();
    }
}