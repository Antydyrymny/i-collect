import { Request, Response } from 'express';
import { updatesRequired } from '../../data';
import { getAuthResponse } from './getAuthResponse';
import { JWTPayload } from '../../types';
import { UserModel } from '../../models';

export const relog = async (req: Request, res: Response) => {
    const relogingUserData = req.user as JWTPayload;

    const relogingUser = await UserModel.findById(relogingUserData._id);

    relogingUser.status = 'online';
    relogingUser.lastLogin = new Date();
    await relogingUser.save();

    const response = getAuthResponse(
        {
            _id: relogingUserData._id,
            admin: relogingUserData.admin,
            name: relogingUserData.name,
        },
        relogingUserData.exp
    );

    updatesRequired.usersStateForAdmins = true;

    res.status(200).json(response);
};
