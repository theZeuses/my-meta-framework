import * as Redis from 'ioredis';
import { redisForMSConfig } from './redis.config';

export class RedisService extends Redis {
    constructor () {
        super(redisForMSConfig);
        console.log("Redis successfully connected!");
    }
}