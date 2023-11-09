import { Request, Response } from 'express';
import { updatesRequired } from '../../data';
import { AuthUser } from '../../types';
import { UserModel } from '../../models';

export const logout = async (req: Request, res: Response) => {
    const userToLogoutData = req.user as AuthUser;

    const userToLogout = await UserModel.findById(userToLogoutData._id);

    userToLogout.status = 'offline';
    await userToLogout.save();

    updatesRequired.usersStateForAdmins = true;

    res.status(200).json('Loged out');
};
