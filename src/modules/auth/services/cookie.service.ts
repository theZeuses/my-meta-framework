import { AppConstants } from "@common/constants";
import { ForbiddenException } from "@core/exceptions";
import { Request } from "express";

export class CookieService {
    private sameSiteAttribute: "strict" | "lax" | "none" = "strict";
    private refreshTokenPath = "/v1/auth/refresh-token";
    private sessionFingerprintCookieName = AppConstants.FINGERPRINT_COOKIE_NAME;

    /**
     * Tries to extract fingerprint from cookies. If not found, throws an exception
     * @throws { ForbiddenException }
     */
    getFingerprintFromCookie(signedCookies: Record<string, string>) {
        const fingerprint = signedCookies[this.sessionFingerprintCookieName];

        if (!fingerprint) {
            throw new ForbiddenException();
        }

        return fingerprint;
    }

    /**
     * Attaches fingerprint cookie to the request
     */
    attachSessionFingerprint(expire_at: Date, fingerprint: string, req: Request) {
        req.res?.cookie(this.sessionFingerprintCookieName, fingerprint, {
            httpOnly: true,
            path: this.refreshTokenPath,
            signed: true,
            sameSite: this.sameSiteAttribute,
            expires: expire_at,
        });
    }

    /**
     * Clears fingerprint cookie from the request
     */
    clearSessionFingerprint(req: Request) {
        req.res?.cookie(this.sessionFingerprintCookieName, "", {
            httpOnly: true,
            path: this.refreshTokenPath,
            signed: true,
            sameSite: this.sameSiteAttribute,
            expires: new Date(),
        });
    }
}