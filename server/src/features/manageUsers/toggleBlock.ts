import { Request, Response } from 'express';
import { UserModel } from '../../models';
import type { ToggleBlockRequest } from '../../types';

export const toggleBlock = async (req: Request, res: Response) => {
    const { action, userIds }: ToggleBlockRequest = req.body;

    const usersToToggleBlock = await UserModel.find({ _id: { $in: userIds } });
    usersToToggleBlock.forEach(
        (user) => (user.status = action === 'block' ? 'blocked' : 'offline')
    );
    await Promise.all(usersToToggleBlock.map((user) => user.save()));

    res.status(200).json(
        `Users ${action === 'block' ? 'blocked' : 'unblocked'} successfully`
    );
};
