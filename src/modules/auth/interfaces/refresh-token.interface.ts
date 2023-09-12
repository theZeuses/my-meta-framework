import { Role } from "@common/constants";

export interface RefreshToken {
    user_id: string,
    fingerprint: string,
    session: string,
    role: valueof<typeof Role>
}