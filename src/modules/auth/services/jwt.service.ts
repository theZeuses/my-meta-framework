import * as jwt from "jsonwebtoken";
import { appConfig } from "@config/app.config";
import { BearerToken, RefreshToken } from "../interfaces";
import { mustBeStringOrFail } from "@common/utils/string.utils";

export class JWTService {
    generateBearerToken(data: BearerToken, exp: string): string {
        return jwt.sign(data, mustBeStringOrFail(appConfig.bearer_token_secret), {
            expiresIn: exp
        });
    }

    generateRefreshToken(data: RefreshToken, exp: string): string {
        return jwt.sign(data, mustBeStringOrFail(appConfig.refresh_token_secret), {
            expiresIn: exp
        });
    }

    authenticateBearerToken(token: string) {
        let payload: BearerToken | null = null;

        jwt.verify(token, mustBeStringOrFail(appConfig.bearer_token_secret), (err, parsed) => {
            if (!err) {
                payload = parsed as BearerToken;
            } else {
                payload = null;
            }
        });

        return payload;
    }

    authenticateRefreshToken(token: string) {
        let payload: RefreshToken | null = null;

        jwt.verify(token, mustBeStringOrFail(appConfig.refresh_token_secret), (err, parsed) => {
            if (!err) {
                payload = parsed as RefreshToken;
            } else {
                payload = null;
            }
        });

        return payload;
    }
}