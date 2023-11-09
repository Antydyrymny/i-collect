import { Request, Response } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../models';
import { signJWT } from './getAuthResponse';
import { blackList } from '../../data';
import {
    ResponseError,
    type RefreshResponse,
    type RefreshTokenRequest,
    AuthUser,
} from '../../types';

dotenv.config();

export const refreshToken = async (req: Request, res: Response<RefreshResponse>) => {
    const { refreshToken }: RefreshTokenRequest = req.body;

    const decodedJWT = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
    ) as AuthUser;
    const user = await UserModel.findById(decodedJWT._id);
    if (!user) throw new ResponseError('Unauthorized', 401);
    if (user.status === 'blocked') {
        blackList.add(user._id.toString());
        throw new ResponseError('Forbidden', 403);
    }

    res.status(200).json({
        token: signJWT({
            _id: decodedJWT._id,
            admin: decodedJWT.admin,
            name: decodedJWT.name,
        }),
    });
};
