import {
    updatesRequired,
    onlineAdminsIdsToSocketIds,
    adminsSkippingUserUpdate,
} from '../../data';
import { UserModelType } from '../../models';

export const informOfUpdates = (reqUser: Express.User) => {
    updatesRequired.usersStateForAdmins = true;

    const admin = reqUser as UserModelType;
    adminsSkippingUserUpdate.add(onlineAdminsIdsToSocketIds.get(admin._id));
};
