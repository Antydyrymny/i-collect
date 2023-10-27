import { Request, Response } from 'express';
import { UserModel } from '../../models';
import { UserPreview } from '../../types';

type UsersQuery = {
    page: string;
    limit: string;
};
export const getUsers = async (req: Request, res: Response) => {
    const queryParams = req.query as UsersQuery;
    const page = parseInt(queryParams.page) || 1;
    const limimt = parseInt(queryParams.limit) || 10;

    const users = await UserModel.find({})
        .skip((page - 1) * limimt)
        .limit(limimt);

    const usersPreview = users.map(
        (user): UserPreview => ({
            _id: user._id,
            admin: user.admin,
            name: user.name,
            status: user.status,
        })
    );

    res.status(200).json(usersPreview);
};
