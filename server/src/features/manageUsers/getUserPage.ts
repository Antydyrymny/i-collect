import { Request, Response } from 'express';
import { UserModel } from '../../models';
import { ResponseError } from '../../types';
import { authorizeResourceOwnership } from './utils';

export const getUserPage = async (req: Request, res: Response) => {
    const ownerId = authorizeResourceOwnership(req);

    const user = await UserModel.findOne({ _id: ownerId });
    if (!user) throw new ResponseError(`User ${ownerId} not found`, 404);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...clientUser } = user;

    res.status(200).json(clientUser);
};
