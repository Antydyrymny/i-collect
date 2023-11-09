import { Request } from 'express';
import {
    updatesRequired,
    onlineAdminsIdsToSocketIds,
    adminsSkippingUserUpdate,
} from '../../data';
import { AuthUser, ResponseError } from '../../types';

export const informOfUpdates = (req: Request) => {
    updatesRequired.usersStateForAdmins = true;

    const admin = req.user as AuthUser;
    adminsSkippingUserUpdate.add(onlineAdminsIdsToSocketIds.get(admin._id));
};

export const authorizeResourceOwnership = (req: Request) => {
    const requestingUser = req.user as AuthUser;

    let ownerId = req.query?.ownerId;

    if (!ownerId) ownerId = requestingUser._id;
    else {
        if (!requestingUser.admin) throw new ResponseError('Unauthorized', 401);
    }

    return ownerId;
};
