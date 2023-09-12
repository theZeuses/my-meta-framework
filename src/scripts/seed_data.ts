import { Model } from "mongoose";

export const seedData = async <T> (collection: Model<T>, data: Array<Record<string, any>>) => {
    await collection.insertMany(data);
}