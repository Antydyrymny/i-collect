import { Request, Response } from 'express';
import { UserModelType } from '../../models';
import { updatesRequired } from '../../data';
import { signJWT } from './signJWT';

export const relog = async (req: Request, res: Response) => {
    const relogingUser = req.user as UserModelType;

    relogingUser.status = 'online';
    relogingUser.lastLogin = new Date();
    await relogingUser.save();

    const response = signJWT(relogingUser);

    updatesRequired.usersStateForAdmins = true;

    res.status(200).json(response);
};
