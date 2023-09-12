import { Role } from "@common/constants";

export interface BearerToken {
    user_id: number | string,
    role: valueof<typeof Role>
}