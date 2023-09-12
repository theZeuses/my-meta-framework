import { Module } from "@core/application";
import { RedisService } from "./redis/redis.service";

@Module({
    providers: [RedisService]
})
export class MemoryStoreModule {}