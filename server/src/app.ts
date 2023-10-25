import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import { notFound, errorHandler } from './middleware';
import { subscribeAdminsToUserEvents } from './features/manageUsers/usersEvents';
import { ClientToServerEvents, ServerToClientEvents } from './types';

const app = express();
const server = createServer(app);
app.use(cors());

export const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
        origin: '*',
    },
});

subscribeAdminsToUserEvents();

app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.use(notFound);
app.use(errorHandler);

export default server;
