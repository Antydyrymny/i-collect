import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../../models';
import { updatesRequired } from '../../data';
import type { RegisterRequest } from '../../types';
import { signJWT } from './signJWT';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password }: RegisterRequest = req.body;

    try {
        const newUser = await UserModel.create({
            admin: false,
            name,
            email,
            password,
            lastLogin: new Date().toISOString(),
            status: 'online',
        });

        const response = signJWT(newUser);

        updatesRequired.usersStateForAdmins = true;

        res.status(200).json(response);
    } catch (error) {
        if (error.code === 11000 && error.message.includes('duplicate')) {
            res.status(409).json('Email is already in use');
        } else next(error);
    }
};
