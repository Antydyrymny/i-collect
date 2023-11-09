import { Request, Response } from 'express';
import { UserModel } from '../../models';
import { informOfUpdates } from './utils';
import type { ToggleAdminRequest } from '../../types';

export const toggleAdmins = async (req: Request, res: Response) => {
    const { action, userIds }: ToggleAdminRequest = req.body;

    const usersToToggleAdminStatus = await UserModel.find({ _id: { $in: userIds } });
    usersToToggleAdminStatus.forEach((user) => (user.admin = action === 'makeAdmin'));
    await Promise.all(usersToToggleAdminStatus.map((user) => user.save()));

    informOfUpdates(req);

    res.status(200).json(
        `Users ${
            action === 'makeAdmin' ? 'made admin' : 'stripped of admin rights'
        } successfully`
    );
};
