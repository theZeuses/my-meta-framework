import * as mongoose from 'mongoose';

export async function truncateCollections(collectionsOrAll: boolean | Array<mongoose.Model<any>>) {
    if (collectionsOrAll === true) {
        const collections = mongoose.connection.collections;

        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany();
        }
    } else if (Array.isArray(collectionsOrAll)) {
        for (const collection of collectionsOrAll) {
            await collection.deleteMany();
        }
    }
}