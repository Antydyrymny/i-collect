import { Request, Response } from 'express';
import { UserModel } from '../../models';

export const countUserPages = async (req: Request, res: Response) => {
    const limit = 10;
    const userCount = await UserModel.countDocuments({});
    const totalPages = Math.ceil(userCount / limit);

    res.status(200).json(totalPages);
};
