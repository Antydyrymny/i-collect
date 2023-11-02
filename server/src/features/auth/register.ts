import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../../models';
import { updatesRequired } from '../../data';
import type { RegisterRequest } from '../../types';
import { signJWT } from './signJWT';
import { faker } from '@faker-js/faker';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password }: RegisterRequest = req.body;

    try {
        const newUser = await UserModel.create({
            name,
            email,
            password,
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

const populate = async () => {
    for (let i = 0; i < 200; i++) {
        await UserModel.create({
            admin: false,
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: 12332112,
            lastLogin: new Date(),
            status: 'offline',
        });
    }
};

// populate();
