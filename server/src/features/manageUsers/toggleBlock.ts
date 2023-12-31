import { Request, Response } from 'express';
import { UserModel } from '../../models';
import { informOfUpdates } from './utils';
import type { ToggleBlockRequest } from '../../types';
import { blackList } from '../../data';

export const toggleBlock = async (req: Request, res: Response) => {
    const { action, userIds }: ToggleBlockRequest = req.body;

    const usersToToggleBlock = await UserModel.find({ _id: { $in: userIds } });
    usersToToggleBlock.forEach(
        (user) => (user.status = action === 'block' ? 'blocked' : 'offline')
    );
    await Promise.all(usersToToggleBlock.map((user) => user.save()));

    informOfUpdates(req);

    usersToToggleBlock.forEach((user) =>
        action === 'block'
            ? blackList.add(user._id.toString())
            : blackList.delete(user._id.toString())
    );

    res.status(200).json(
        `Users ${action === 'block' ? 'blocked' : 'unblocked'} successfully`
    );
};
