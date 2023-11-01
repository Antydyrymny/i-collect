import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import type { AuthResponse, UserModelType } from '../../types';

dotenv.config();

export const signJWT = (user: UserModelType): AuthResponse => {
    const jwtToken = jwt.sign(
        {
            _id: user._id,
        },
        process.env.JWT_SECRET
    );

    const response: AuthResponse = {
        _id: user._id,
        admin: user.admin,
        name: user.name,
        token: jwtToken,
    };

    return response;
};
