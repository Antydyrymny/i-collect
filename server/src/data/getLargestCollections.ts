import { CollectionModel } from '../models';
import { getCollectionPreview } from '../features/collections';
import { largestCollections, largestCollectionsLimit } from '.';

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
