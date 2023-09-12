import { mustBeStringOrFail } from "@common/utils/string.utils";
import { dbConfig } from "@src/config";
import { ConnectOptions } from "mongoose";

export type MongoConfig = ConnectOptions & {
    url: string
}

export const mongoConfig: MongoConfig = {
    url: mustBeStringOrFail(dbConfig.mongoURI)
}