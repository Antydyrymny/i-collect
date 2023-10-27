import { Request, Response } from 'express';
import { UserModel } from '../../models';

export const deleteUsers = async (req: Request, res: Response) => {
    const userIds: string[] = req.body;
    console.log(userIds);
    await UserModel.deleteMany({
        _id: { $in: userIds },
    });

    res.status(200).json('Users deleted successfully');
};
