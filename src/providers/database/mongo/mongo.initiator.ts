import { mongoConfig } from "./mongo.config";
import { MongoProvider } from "./mongo.provider";

export class MongoInit {
    constructor () {
        new MongoProvider(mongoConfig)
    }
}