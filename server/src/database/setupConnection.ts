import mongoose, { ConnectOptions } from 'mongoose';
import { upsertAllSearchIndexes } from '../models';
import dotenv from 'dotenv';
import { getLargestCollections, getLatestItems } from '../data';

dotenv.config();
const connectionString = process.env.MONGODB_CONNECTION_STRING;

export const connectDB = async () => {
    await mongoose.connect(connectionString, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    } as ConnectOptions);
    console.log('MongoDB Connected');

    await upsertAllSearchIndexes();
    console.log('Search indexes verified');

    await getLatestItems();
    await getLargestCollections();
    console.log('Initial data ready');
};

export const disconnectDB = () => {
    mongoose.disconnect();
    console.log('MongoDB Disconnected');
};
