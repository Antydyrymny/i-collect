import { io } from '../../../app';
import { TagModel } from '../../../models';
import { DefaultEvents, Indexes, ItemViewerToServer, Routes } from '../../../types';

export function subscribeToItemUpdates() {
    io.of(Routes.Api + Routes.ItemSocket).on(DefaultEvents.Connection, (socket) => {
        socket.on(ItemViewerToServer.SubscribingToItem, (itemId) => {
            socket.join(itemId);
        });

        socket.on(ItemViewerToServer.AutocompleteTag, async (query, acknowledgeTag) => {
            const pipeline = [];
            pipeline.push({
                $search: {
                    index: Indexes.TagAutoComplete,
                    autocomplete: {
                        query: query,
                        path: 'name',
                    },
                },
            });
            pipeline.push({
                $project: {
                    _id: 0,
                    name: 1,
                    score: { $meta: 'searchScore' },
                },
            });

            try {
                const result = await TagModel.aggregate(pipeline)
                    .sort({ score: -1 })
                    .limit(4);
                acknowledgeTag(result.map((tag) => tag.name));
            } catch (error) {
                console.log(
                    `Tag autocomplete search failed with error: ${error.message}`
                );
                acknowledgeTag([]);
            }
        });
    });
}
