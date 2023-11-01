import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../../models';
import { ResponseError, UserModelType, UserQuery } from '../../types';

export const getUserPage = async (req: Request, res: Response, next: NextFunction) => {
    const queryParams = req.query as UserQuery;
    const targetId = queryParams.id;

    const requestingUser = req.user as UserModelType;
    if (requestingUser._id !== targetId || !requestingUser.admin) {
        next(new ResponseError('Unauthorized', 401));
    }

    const user = await UserModel.findOne({ _id: targetId });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...clientUser } = user;

    res.status(200).json(clientUser);
};
