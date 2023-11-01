import { Request, Response } from 'express';
import { updatesRequired } from '../../data';
import { UserModelType } from '../../types';

export const logout = async (req: Request, res: Response) => {
    const userToLogout = req.user as UserModelType;

    userToLogout.status = 'offline';
    await userToLogout.save();

    updatesRequired.usersStateForAdmins = true;

    res.status(200).json('Loged out');
};
