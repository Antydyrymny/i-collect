import dotenv from 'dotenv';

dotenv.config();

export const onlineAdminsIdsToSocketIds = new Map<string, string>();
export const adminsSkippingUserUpdate = new Set<string>();

export const latestItemsLimit = +process.env.LATEST_ITEMS_LIMIT;
export const latestItems = [];
export { getLatestItems } from './getLatestItems';

export const largestCollectionsLimit = +process.env.LARGEST_COLLECTIONS_LIMIT;
export const largestCollections = [];
export { getLargestCollections } from './getLargestCollections';

export const blackList = new Set<string>();
export { getBlockedUsers } from './getBlockedUsers';

export const updatesRequired = {
    usersStateForAdmins: false,
    latestItems: false,
    largestCollections: false,
};
