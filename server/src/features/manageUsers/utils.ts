import { Request } from 'express';
import {
    updatesRequired,
    onlineAdminsIdsToSocketIds,
    adminsSkippingUserUpdate,
} from '../../data';
import { ResponseError, UserModelType } from '../../types';

export const informOfUpdates = (reqUser: Express.User) => {
    updatesRequired.usersStateForAdmins = true;

    const admin = reqUser as UserModelType;
    adminsSkippingUserUpdate.add(onlineAdminsIdsToSocketIds.get(admin._id));
};

export const authorizeResourceOwnership = (req: Request) => {
    const requestingUser = req.user as UserModelType;

    let ownerId = req.query?.ownerId;

    if (!ownerId) ownerId = requestingUser._id;
    else {
        if (!requestingUser.admin) throw new ResponseError('Unauthorized', 401);
    }

    return ownerId;
};
