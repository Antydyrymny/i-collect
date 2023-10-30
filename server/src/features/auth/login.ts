import { Request, Response } from 'express';
import { UserModel } from '../../models';
import type { LoginRequest } from '../../types';
import { signJWT } from './signJWT';
import { updatesRequired } from '../../data';

export const login = async (req: Request, res: Response) => {
    const { email, password }: LoginRequest = req.body;

    const userWithEmail = await UserModel.findOne({ email });
    if (!userWithEmail || userWithEmail.password !== password) {
        res.status(401).json('Email or password does not match');
        return;
    } else if (userWithEmail.status === 'blocked') {
        res.status(403).json('You are blocked! Access forbidden');
        return;
    }

    userWithEmail.status = 'online';
    userWithEmail.lastLogin = new Date().toISOString();
    await userWithEmail.save();

    const response = signJWT(userWithEmail);

    updatesRequired.usersStateForAdmins = true;

    res.status(200).json(response);
};
