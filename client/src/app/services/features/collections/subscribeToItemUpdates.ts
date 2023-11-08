import apiSlice from '../../api';
import { getItemViewerSocket } from '../../getSocket';
import {
    ApiBuilder,
    GetItemCommentsQuery,
    ItemViewerToServer,
    ServerToItemViewer,
} from '../../../../types';

export const subscribeToItemUpdates = (builder: ApiBuilder) =>
    builder.query<void, string>({
        queryFn: (itemId) => {
            const itemViewerSocket = getItemViewerSocket();
            itemViewerSocket.emit(ItemViewerToServer.SubscribingToItem, itemId);
            return { data: undefined };
        },
        async onCacheEntryAdded(
            itemId,
            { cacheDataLoaded, cacheEntryRemoved, dispatch }
        ) {
            try {
                await cacheDataLoaded;
                const itemViewerSocket = getItemViewerSocket();

                itemViewerSocket.on(ServerToItemViewer.LikesUpdated, (newLikesNumber) => {
                    dispatch(
                        apiSlice.util.updateQueryData('getItem', itemId, (draft) => ({
                            ...draft,
                            likesNumber: newLikesNumber,
                        }))
                    );
                });

                itemViewerSocket.on(ServerToItemViewer.NewComment, (newComment) => {
                    dispatch(
                        apiSlice.util.updateQueryData(
                            'getItemComments',
                            'getItemComments' as unknown as GetItemCommentsQuery,
                            (draft) => [...draft, newComment]
                        )
                    );
                });

                itemViewerSocket.on(
                    ServerToItemViewer.CommentUpdated,
                    (commentUpdate) => {
                        dispatch(
                            apiSlice.util.updateQueryData(
                                'getItemComments',
                                'getItemComments' as unknown as GetItemCommentsQuery,
                                (draft) =>
                                    draft.map((comment) =>
                                        comment._id === commentUpdate._id
                                            ? {
                                                  ...comment,
                                                  content: commentUpdate.content,
                                              }
                                            : comment
                                    )
                            )
                        );
                    }
                ),
                    itemViewerSocket.on(
                        ServerToItemViewer.CommentDeleted,
                        (deletedCommentId) => {
                            dispatch(
                                apiSlice.util.updateQueryData(
                                    'getItemComments',
                                    'getItemComments' as unknown as GetItemCommentsQuery,
                                    (draft) =>
                                        draft.filter(
                                            (comment) => comment._id !== deletedCommentId
                                        )
                                )
                            );
                        }
                    ),
                    await cacheEntryRemoved;

                itemViewerSocket.off(ServerToItemViewer.LikesUpdated);
                itemViewerSocket.off(ServerToItemViewer.NewComment);
                itemViewerSocket.off(ServerToItemViewer.CommentUpdated);
                itemViewerSocket.off(ServerToItemViewer.CommentDeleted);
            } catch {
                // if cacheEntryRemoved resolved before cacheDataLoaded,
                // cacheDataLoaded throws
            }
        },
    });

export const autocompleteTag = (builder: ApiBuilder) =>
    builder.query<string[], string>({
        queryFn: (query) => {
            const itemViewerSocket = getItemViewerSocket();

            return new Promise((resolve) => {
                itemViewerSocket.emit(
                    ItemViewerToServer.AutocompleteTag,
                    query,
                    (tagSuggestions) => {
                        resolve({
                            data: tagSuggestions,
                        });
                    }
                );
            });
        },
    });
