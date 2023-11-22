import { ItemModel } from '../models';
import { latestItems, latestItemsLimit } from '.';
import { getItemResponse } from '../features/collections';
import { Schema } from 'mongoose';

export const getLatestItems = async () => {
    try {
        const foundItems = await ItemModel.find()
            .populate<{ parentCollection: { _id: Schema.Types.ObjectId; name: string } }>(
                'parentCollection',
                'name'
            )
            .sort({ createdAt: -1 })
            .limit(latestItemsLimit + 1);
        foundItems.forEach((item) =>
            latestItems.push(
                getItemResponse(
                    item,
                    item.parentCollection._id,
                    item.parentCollection.name
                )
            )
        );
    } catch (error) {
        console.log(`Failed to fetch latest items, error: ${error.message}`);
    }
};
