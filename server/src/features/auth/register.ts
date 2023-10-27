import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserModel } from '../../models';
import { updatesRequired } from '../../data';
import type { RegisterRequest, AuthResponse } from '../../types';

dotenv.config();

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password }: RegisterRequest = req.body;
    const newUser = await UserModel.create({
        admin: false,
        name,
        email,
        password,
        lastLogin: new Date().toISOString(),
        status: 'online',
    });
    try {
        const jwtToken = jwt.sign(
            {
                _id: newUser._id,
            },
            process.env.JWT_SECRET
        );
        const response: AuthResponse = {
            _id: newUser._id,
            admin: false,
            name,
            token: jwtToken,
        };

        updatesRequired.usersStateForAdmins = true;

        res.status(200).json(response);
    } catch (error) {
        if (error.code === 11000 && error.message.includes('duplicate'))
            res.status(409).json('Email is already in use');
        else next(error);
    }
};
