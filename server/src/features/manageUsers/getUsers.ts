import { Request, Response } from 'express';

import { UserModel } from '../../models';

type UsersQuery = {
    page: string;
    limit: string;
};
export const getUsers = async (
    req: Request<object, object, object, UsersQuery>,
    res: Response
) => {
    const page = parseInt(req.query.page) || 1;
    const limimt = parseInt(req.query.limit) || 10;

    const users = await UserModel.find({})
        .skip((page - 1) * limimt)
        .limit(limimt);

    res.status(200).json(users);
};
