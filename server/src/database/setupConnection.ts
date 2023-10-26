import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const connectionString = process.env.MONGODB_URL;

export const connectDB = async () => {
    await mongoose.connect(connectionString, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    } as ConnectOptions);
    console.log('MongoDB Connected');
};

export const disconnectDB = () => {
    mongoose.disconnect();
    console.log('MongoDB Disconnected');
};
