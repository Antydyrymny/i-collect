export const onlineAdminsIdsToSocketIds = new Map<string, string>();
export const adminsSkippingUserUpdate = new Set<string>();

export const latestItemsLimit = 5;
export const latestItems = [];
export { getLatestItems } from './getLatestItems';

export const largestCollectionsLimit = 5;
export const largestCollections = [];
export { getLargestCollections } from './getLargestCollections';

export const blackList = new Set<string>();
export { getBlockedUsers } from './getBlockedUsers';

export const updatesRequired = {
    usersStateForAdmins: false,
    latestItems: false,
    largestCollections: false,
};
