import { redisConfig } from "@src/config";
import { QueueOptions } from "bull";

export const bullConfig: QueueOptions = {
    redis: {
        ...redisConfig,
        db: 2
    },
    prefix: "bull-"
}