import * as mongoose from 'mongoose';
import { Model } from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo: MongoMemoryServer | undefined = undefined;

export const setUpMemoryMongo = async () => {
    if (mongo) return mongo;
    mongo = await MongoMemoryServer.create();
    const url = mongo.getUri();

    await mongoose.connect(url);
};

export const seedTestData = async <T> (collection: Model<T>, data: Array<Record<string, any>>) => {
    await setUpMemoryMongo();

    await collection.insertMany(data);
}

export const dropDatabase = async () => {
    if (mongo) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongo.stop();
    }
};

export const dropCollections = async () => {
    if (mongo) {
        const collections = mongoose.connection.collections;

        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany();
        }
    }
};

export const closeMemoryMongoConnection = async () => {
    if (mongo) {
        await mongoose.connection.close();
        mongo = undefined;
    }
}