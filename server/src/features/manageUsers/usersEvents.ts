import { io } from '../../app';
import {
    adminsSkippingUserUpdate,
    onlineAdminsIdsToSocketIds,
    updatesRequired,
} from '../../data';
import { Routes, AdminToServer, DefaultEvents, ServerToAdmin } from '../../types';

export function subscribeAdminsToUserEvents() {
    io.of(Routes.Api + Routes.ManageUsers).on(DefaultEvents.Connection, (socket) => {
        socket.on(AdminToServer.SubscribingToUserUpdates, (adminId) => {
            onlineAdminsIdsToSocketIds.set(adminId, socket.id);
        });

        socket.on(DefaultEvents.Disconnecting, () => {
            const adminId = Array.from(onlineAdminsIdsToSocketIds.entries()).find(
                (entry) => entry[1] === socket.id
            )?.[0];
            if (adminId) onlineAdminsIdsToSocketIds.delete(adminId);
        });
    });
}

setInterval(() => {
    if (!updatesRequired.usersStateForAdmins) return;

    Array.from(onlineAdminsIdsToSocketIds.values()).forEach((socketId) => {
        if (adminsSkippingUserUpdate.has(socketId)) return;

        io.of(Routes.Api + Routes.ManageUsers)
            .to(socketId)
            .emit(ServerToAdmin.UsersUpdated);
    });
}, 10000);
