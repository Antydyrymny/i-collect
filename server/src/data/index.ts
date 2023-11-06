import { getCollectionPreview, getItemPreview } from '../features/collections/utils';
import { CollectionModel, ItemModel } from '../models';

export const onlineAdminsIdsToSocketIds = new Map<string, string>();
export const adminsSkippingUserUpdate = new Set<string>();

export const latestItemsLimit = 5;
export const latestItems = [];
export const getLatestItems = async () => {
    try {
        const foundItems = await ItemModel.find()
            .sort({ createdAt: -1 })
            .limit(latestItemsLimit + 1);
        foundItems.forEach((item) => latestItems.push(getItemPreview(item)));
    } catch (error) {
        console.log(`Failed to fetch latest items, error: ${error.message}`);
    }
};

export const largestCollectionsLimit = 5;
export const largestCollections = [];
export const getLargestCollections = async () => {
    try {
        const foundCollections = await CollectionModel.aggregate([
            {
                $match: { items: { $exists: true, $ne: [] } },
            },
            {
                $addFields: {
                    itemsCount: { $size: '$items' },
                },
            },
        ])
            .sort({ itemsCount: -1 })
            .limit(largestCollectionsLimit + 1);

        foundCollections.forEach((collection) =>
            largestCollections.push(getCollectionPreview(collection))
        );
    } catch (error) {
        console.log(`Failed to fetch largest collections, error: ${error.message}`);
    }
};

export const updatesRequired = {
    usersStateForAdmins: false,
    latestItems: false,
    largestCollections: false,
};
