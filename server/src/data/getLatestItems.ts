import { ItemModel } from '../models';
import { latestItems, latestItemsLimit } from '.';
import { getItemPreview } from '../features/collections';

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
