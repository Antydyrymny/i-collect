import { Request, Response } from 'express';
import { UserModelType } from '../../models';

export const logout = async (req: Request, res: Response) => {
    const userToLogout = req.user as UserModelType;
    userToLogout.status = 'offline';
    await userToLogout.save();

    res.status(200).json('Loged out');
};
