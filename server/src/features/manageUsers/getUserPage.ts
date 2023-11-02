import { Request, Response } from 'express';
import { UserModel } from '../../models';
import { UserQuery } from '../../types';

export const getUserPage = async (req: Request, res: Response) => {
    const queryParams = req.query as UserQuery;
    const targetId = queryParams.id;

    const user = await UserModel.findOne({ _id: targetId });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...clientUser } = user;

    res.status(200).json(clientUser);
};
