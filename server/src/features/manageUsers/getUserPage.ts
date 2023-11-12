import { Request, Response } from 'express';
import { UserModel } from '../../models';
import { ClientUser, ResponseError } from '../../types';
import { authorizeResourceOwnership } from './utils';

export const getUserPage = async (req: Request, res: Response<ClientUser>) => {
    const ownerId = authorizeResourceOwnership(req);
    const user = await UserModel.findOne({ _id: ownerId });
    if (!user) throw new ResponseError(`User ${ownerId} not found`, 404);

    res.status(200).json({
        _id: user._id,
        admin: user.admin,
        status: user.status,
        name: user.name,
        email: user.email,
        collections: user.collections,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
    });
};
