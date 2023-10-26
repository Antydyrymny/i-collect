import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserModel } from '../../models';
import type { LoginRequest, AuthResponse } from '../../types';

dotenv.config();

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

    userWithEmail.lastLogin = new Date().toISOString();
    userWithEmail.status = 'online';
    await userWithEmail.save();

    const jwtToken = jwt.sign(
        {
            _id: userWithEmail._id,
        },
        process.env.JWT_SECRET
    );

    const response: AuthResponse = {
        _id: userWithEmail._id,
        admin: userWithEmail.admin,
        name: userWithEmail.name,
        token: jwtToken,
    };
    res.status(200).json(response);
};
