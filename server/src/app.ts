import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { connectDB, disconnectDB } from './database/setupConnection';
import { notFound, errorHandler } from './middleware';
import { subscribeAdminsToUserEvents } from './features/manageUsers';
import { router, protectedRouter, adminRouter } from './routes';
import { ClientToServerEvents, ServerToClientEvents } from './types';

const app = express();
const server = createServer(app);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

connectDB();

export const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
        origin: '*',
    },
});

subscribeAdminsToUserEvents();

app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.use('/v1', router);
app.use('/v1', protectedRouter);
app.use('/v1', adminRouter);

app.use(notFound);
app.use(errorHandler);

process.on('SIGINT', () => {
    disconnectDB();
    process.exit(0);
});
process.on('SIGTERM', () => {
    disconnectDB();
    process.exit(0);
});

export default server;
