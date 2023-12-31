import { Request, Response } from 'express';
import { UserModel } from '../../models';
import { UserPreview, UsersQuery } from '../../types';

export const getUsers = async (req: Request, res: Response) => {
    const queryParams = req.query as UsersQuery;
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;

    const users = await UserModel.find({})
        .skip((page - 1) * limit)
        .limit(limit);

    const usersPreview = users.map(
        (user): UserPreview => ({
            _id: user._id,
            admin: user.admin,
            name: user.name,
            status: user.status,
            lastLogin: user.lastLogin,
        })
    );

    res.status(200).json(usersPreview);
};
