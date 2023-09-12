import { redisConfig } from "@src/config";
import { RedisOptions } from "ioredis";

export const redisForMSConfig: RedisOptions = {
    ...redisConfig,
    db: 1
}