import { Injectable } from "@core/application";
import { UserDocument } from "@modules/user/schema/user.schema";
import { BearerToken, RefreshToken } from "../interfaces";
import { JWTService } from "./jwt.service";
import { Role } from "@common/constants";

@Injectable()
export class TokenService {
    private readonly bearer_token_life_length: string;
    private readonly refresh_token_life_length: string;

    private readonly bearer_token_life_ahead_in_milliseconds: number;
    private readonly refresh_token_life_ahead_in_milliseconds: number;

    constructor(private readonly jwtService: JWTService) {
        this.bearer_token_life_length = "1h";
        this.refresh_token_life_length = "30d";
        this.bearer_token_life_ahead_in_milliseconds = 1 * 60 * 60 * 1000;
        this.refresh_token_life_ahead_in_milliseconds = 30 * 24 * 60 * 60 * 1000;
    }

    async signTokens(user: PartialPartial<UserDocument, "password">, session: string, fingerprint: string) {
        const bearerTokenPayload: BearerToken = {
            user_id: user._id,
            role: user.role || Role.USER
        }

        const refreshTokenPayload: RefreshToken = {
            user_id: user._id,
            role: user.role || Role.USER,
            session,
            fingerprint
        }

        const bearerToken = this.jwtService.generateBearerToken(bearerTokenPayload, this.bearer_token_life_length);
        const refreshToken = this.jwtService.generateRefreshToken(refreshTokenPayload, this.refresh_token_life_length);

        return {
            auth: {
                bearer: {
                    token: bearerToken,
                    expires_at: Date.now() + this.bearer_token_life_ahead_in_milliseconds,
                },
                refresh: {
                    token: refreshToken,
                    expires_at: Date.now() + this.refresh_token_life_ahead_in_milliseconds,
                }
            }
        }
    }
}