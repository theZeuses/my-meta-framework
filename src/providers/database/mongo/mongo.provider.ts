import { Mongoose, connect } from "mongoose";
import { MongoConfig } from "./mongo.config";

export class MongoProvider {
    private mongo: Mongoose;

    constructor (private readonly config: MongoConfig) {
        const { url, ...connectOptions } = this.config;
        connect(url, connectOptions).then((mongo) => {
            this.mongo = mongo;
            console.log("Mongodb Successfully connected!")
        }).catch(err => console.log(err))
    }

    getInstance () {
        return this.mongo;
    }
}