import { blackList } from '.';
import { UserModel } from '../models';

export const getBlockedUsers = async () => {
    try {
        const blockedusers = await UserModel.find({ status: 'blocked' });
        blockedusers.forEach((blockedUser) => blackList.add(blockedUser._id.toString()));
    } catch (error) {
        console.log(`Failed to fetch blocked users, error: ${error.message}`);
    }
};
