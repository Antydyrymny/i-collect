import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import cors from 'cors';
import { notFound, errorHandler } from './middleware';
import { ServerToClientEvents } from './types';
// import subscribeToFeatures from './features/rooms/roomEvents';

const app = express();
const server = createServer(app);
app.use(cors());

export const io = new Server<DefaultEventsMap, ServerToClientEvents>(server, {
    cors: {
        origin: '*',
    },
});

app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.use(notFound);
app.use(errorHandler);

// subscribeToFeatures();

export default server;
