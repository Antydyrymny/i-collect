import { Request, Response } from 'express';
import { UserModelType } from '../../models';
import { updatesRequired } from '../../data';

export const relog = async (req: Request, res: Response) => {
    const relogingUser = req.user as UserModelType;

    relogingUser.status = 'online';
    relogingUser.lastLogin = new Date().toISOString();
    await relogingUser.save();

    updatesRequired.usersStateForAdmins = true;

    res.status(200).json('Reloged');
};
