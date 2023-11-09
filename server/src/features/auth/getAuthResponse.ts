import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import type { AuthResponse, AuthUser } from '../../types';

dotenv.config();

const tokenLiveTime = parseInt(process.env.JWT_LIVE_TIME);
export const signJWT = (authUser: AuthUser, expiresAt?: number) =>
    jwt.sign(authUser, process.env.JWT_SECRET, {
        expiresIn: expiresAt ? expiresAt - Math.floor(Date.now() / 1000) : tokenLiveTime,
    });

export const getAuthResponse = (authUser: AuthUser, expiresAt?: number): AuthResponse => {
    const jwtRefreshToken = jwt.sign(authUser, process.env.JWT_REFRESH_SECRET);

    const jwtToken = expiresAt ? signJWT(authUser, expiresAt) : signJWT(authUser);

    const response: AuthResponse = {
        ...authUser,
        token: jwtToken,
        refreshToken: jwtRefreshToken,
    };

    return response;
};
