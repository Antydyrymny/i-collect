import { Request, Response } from 'express';
import { UserModel } from '../../models';
import type { LoginRequest } from '../../types';
import { getAuthResponse } from './getAuthResponse';
import { updatesRequired } from '../../data';

export const login = async (req: Request, res: Response) => {
    const { email, password }: LoginRequest = req.body;

    const userWithEmail = await UserModel.findOne({ email });

    if (!userWithEmail || userWithEmail.password !== password) {
        res.status(401).json('Email or password does not match');
        return;
    } else if (userWithEmail.status === 'blocked') {
        res.status(403).json('Your account is blocked! Access forbidden');
        return;
    }

    userWithEmail.status = 'online';
    userWithEmail.lastLogin = new Date();
    await userWithEmail.save();

    const response = getAuthResponse({
        _id: userWithEmail._id,
        admin: userWithEmail.admin,
        name: userWithEmail.name,
    });

    updatesRequired.usersStateForAdmins = true;

    res.status(200).json(response);
};
