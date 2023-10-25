import { io } from '../../app';
import { DefaultEvents, DefaultRooms } from '../../types';

export function subscribeAdminsToUserEvents() {
    io.of('/api/manageUsers').on(DefaultEvents.Connection, (socket) => {
        socket.join(DefaultRooms.onlineAdmins);
    });
}
