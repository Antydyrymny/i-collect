import { io } from '../../app';
import {
    getLargestCollections,
    getLatestItems,
    largestCollections,
    largestCollectionsLimit,
    latestItems,
    latestItemsLimit,
    updatesRequired,
} from '../../data';
import { CommentModel, ItemModel } from '../../models';
import {
    DefaultEvents,
    DefaultRooms,
    HomeToServer,
    HomeUpdate,
    Indexes,
    Routes,
    ServerToHome,
} from '../../types';
import { getItemPreview } from './utils';

export function subscribeToHomeUpdates() {
    io.of(Routes.Api + Routes.HomeSocket).on(DefaultEvents.Connection, (socket) => {
        socket.on(HomeToServer.SubscribingToHome, (acknowledgeHomeData) => {
            socket.join(DefaultRooms.Home);
            acknowledgeHomeData({
                latestItems,
                largestCollections,
            });
        });

        socket.on(HomeToServer.SearchingItems, async (query, acknowledgeSearch) => {
            if (!query || typeof query !== 'string') {
                acknowledgeSearch([]);
                return;
            }

            const addSortScoreAndSort = [
                {
                    $addFields: {
                        score: { $meta: 'searchScore' },
                    },
                },
                {
                    $sort: { score: -1 },
                },
            ];

            const itemPipeline = [];
            itemPipeline.push({
                $search: {
                    index: Indexes.ItemFullTextSearch,
                    text: {
                        query: query,
                        path: [
                            'name',
                            'tags',
                            { wildcard: 'stringFields.*' },
                            { wildcard: 'textFields.*' },
                        ],
                        fuzzy: { maxEdits: 1 },
                    },
                },
            });
            itemPipeline.push(...addSortScoreAndSort);

            const commentPipeLine = [];
            commentPipeLine.push({
                $search: {
                    index: Indexes.CommentFullTextSearch,
                    text: {
                        query: query,
                        path: 'content',
                        fuzzy: { maxEdits: 1 },
                    },
                },
            });
            commentPipeLine.push(...addSortScoreAndSort);

            try {
                const [items, comments] = await Promise.all([
                    ItemModel.aggregate(itemPipeline).limit(3),
                    CommentModel.aggregate(commentPipeLine).limit(3),
                ]);

                const commentsToInclude = comments.filter((comment) =>
                    items.every((item) => !item._id.equals(comment._id))
                );
                const commentsItems = await Promise.all(
                    commentsToInclude.map((comment) => ItemModel.findById(comment.toItem))
                );

                acknowledgeSearch(
                    [...items, ...commentsToInclude]
                        .sort((a, b) => b.score - a.score)
                        .slice(0, 4)
                        .map((searchRes) =>
                            searchRes.toItem
                                ? getItemPreview(
                                      commentsItems.find((item) =>
                                          item._id.equals(searchRes.toItem)
                                      )
                                  )
                                : getItemPreview(searchRes, true)
                        )
                );
            } catch (error) {
                console.log(`Homepage search failed with error: ${error.message}`);
                acknowledgeSearch([]);
            }
        });
    });
}

setInterval(async () => {
    if (!updatesRequired.latestItems && !updatesRequired.largestCollections) return;

    if (latestItems.length < latestItemsLimit) {
        await getLatestItems();
    }
    if (largestCollections.length < largestCollectionsLimit) {
        await getLargestCollections();
    }

    const update: HomeUpdate = {};
    if (updatesRequired.latestItems)
        update.latestItems = latestItems.slice(0, latestItemsLimit);
    if (updatesRequired.largestCollections)
        update.largestCollections = largestCollections.slice(0, largestCollectionsLimit);

    io.of(Routes.Api + Routes.HomeSocket)
        .to(DefaultRooms.Home)
        .emit(ServerToHome.HomeUpdated, update);

    updatesRequired.latestItems = false;
    updatesRequired.largestCollections = false;
}, 5000);
