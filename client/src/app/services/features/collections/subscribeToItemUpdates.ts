import apiSlice from '../../api';
import { getItemViewerSocket } from '../../getSocket';
import {
    ApiBuilder,
    GetItemCommentsQuery,
    GetItemQuery,
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
                        apiSlice.util.updateQueryData(
                            'getItem',
                            itemId as unknown as GetItemQuery,
                            (draft) => ({
                                ...draft,
                                likesNumber: newLikesNumber,
                            })
                        )
                    );
                });

                itemViewerSocket.on(ServerToItemViewer.NewComment, (newComment) => {
                    dispatch(
                        apiSlice.util.updateQueryData(
                            'getItemComments',
                            'getItemComments' as unknown as GetItemCommentsQuery,
                            (draft) => ({
                                comments: [newComment, ...draft.comments],
                                moreToFetch: draft.moreToFetch,
                            })
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
                                (draft) => ({
                                    comments: draft.comments.map((comment) =>
                                        comment._id === commentUpdate._id
                                            ? {
                                                  ...comment,
                                                  content: commentUpdate.content,
                                              }
                                            : comment
                                    ),
                                    moreToFetch: draft.moreToFetch,
                                })
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
                                    (draft) => ({
                                        comments: draft.comments.filter(
                                            (comment) => comment._id !== deletedCommentId
                                        ),
                                        moreToFetch: draft.moreToFetch,
                                    })
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

            return query === ''
                ? { data: [] }
                : new Promise((resolve) => {
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
