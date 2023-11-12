import { Request, Response } from 'express';
import { updatesRequired } from '../../data';
import { AuthUser } from '../../types';
import { UserModel } from '../../models';

export const setOnline = async (req: Request, res: Response) => {
    const relogingUserData = req.user as AuthUser;

    const relogingUser = await UserModel.findById(relogingUserData._id);

    relogingUser.status = 'online';
    relogingUser.lastLogin = new Date();
    await relogingUser.save();

    updatesRequired.usersStateForAdmins = true;

    res.status(200).json('Status changed to Online');
};
