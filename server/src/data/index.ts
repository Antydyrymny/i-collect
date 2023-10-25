import { User } from 'src/types';

export const adminsAwaitingUserUpdates = new Map<string, User>();
export const updatesRequired = {
    usersStateForAdmins: false,
};
