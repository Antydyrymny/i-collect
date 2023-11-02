import mongoose, { ConnectOptions } from 'mongoose';
import { upsertAllSearchIndexes } from '../models';
import dotenv from 'dotenv';

dotenv.config();
const connectionString = process.env.MONGODB_CONNECTION_STRING;

export const connectDB = async () => {
    await mongoose.connect(connectionString, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    } as ConnectOptions);

    await upsertAllSearchIndexes();

    console.log('MongoDB Connected');
};

export const disconnectDB = () => {
    mongoose.disconnect();
    console.log('MongoDB Disconnected');
};
