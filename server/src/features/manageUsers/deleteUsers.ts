import { Request, Response } from 'express';
import { UserModel } from '../../models';
import { informOfUpdates } from './utils';

export const deleteUsers = async (req: Request, res: Response) => {
    const userIds: string[] = req.body;
    await UserModel.deleteMany({
        _id: { $in: userIds },
    });

    informOfUpdates(req);

    res.status(200).json('Users deleted successfully');
};
