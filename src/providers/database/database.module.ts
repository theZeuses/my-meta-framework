import { Module } from "@core/application";
import { MongoInit } from "./mongo/mongo.initiator";

@Module({
    providers: [MongoInit]
})
export class DatabaseModule {}