import { Request, Response } from 'express';
import { UserModelType } from '../../models';
import { updatesRequired } from '../../data';

export const logout = async (req: Request, res: Response) => {
    const userToLogout = req.user as UserModelType;
    userToLogout.status = 'offline';
    await userToLogout.save();

    updatesRequired.usersStateForAdmins = true;

    res.status(200).json('Loged out');
};
