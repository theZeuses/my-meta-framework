import { Role } from "@common/constants";
import { UUIDService } from "@common/services";
import { Injectable } from "@core/application";
import { RedisService } from "@providers/memory-store/redis/redis.service";

type SessionPayload = {
  agent?: string,
  created_at: number
}

const SessionPayloadKey: Record<keyof SessionPayload, keyof SessionPayload> = {
  agent: "agent",
  created_at: "created_at"
}

@Injectable()
export class SessionService {
  private session_life_in_seconds;

  constructor(
    private readonly redisService: RedisService,
    private readonly uuidService: UUIDService
  ) {
    this.session_life_in_seconds = 30 * 24 * 60 * 60;
  }

  async generateSession(data: {
    user_id: string,
    role: valueof<typeof Role>,
    payload: SessionPayload
  }) {
    let sessionId = this.uuidService.uuid();

    await this.redisService.hmset(this.generateSessionKeyForRedis({
      ...data,
      sessionId
    }), data.payload);

    await this.redisService.expire(this.generateSessionKeyForRedis({
      ...data,
      sessionId
    }), this.session_life_in_seconds);

    return sessionId;
  }

  async refreshSession(sessionId: string, data: {
    user_id: string,
    role: valueof<typeof Role>
  }) {
    await this.redisService.expire(this.generateSessionKeyForRedis({
      ...data,
      sessionId
    }), this.session_life_in_seconds);
  }

  async isValidSession(data: {
    user_id: string,
    role: valueof<typeof Role>
  }, sessionId: string) {
    const created_at = await this.redisService.hget(this.generateSessionKeyForRedis({
      ...data,
      sessionId
    }), SessionPayloadKey.created_at);

    if (created_at == undefined || created_at == null) return false;

    return true;
  }

  async deleteSession(user_id: string, user_type: valueof<typeof Role>, sessionId: string) {
    return this.redisService.del(this.generateSessionKeyForRedis({
      user_id,
      role: user_type,
      sessionId
    }));
  }

  private generateSessionKeyForRedis(data: {
    role: valueof<typeof Role>,
    user_id: string | number,
    sessionId: string
  }) {
    return `${data.role.toLowerCase()}:${data.user_id}:auth-session:${data.sessionId}`
  }
}
