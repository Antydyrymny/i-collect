import api from '../../api';
import { toast } from 'react-toastify';
import {
    ApiBuilder,
    CollectionPreview,
    CollectionResponse,
    CollectionsPreviewQuery,
    DeleteCollectionReq,
    GetCollectionQuery,
    GetUserCollectionQuery,
    NewCollectionReq,
    NewCollectionRes,
    Routes,
    UpdateCollectionReq,
    UserCollections,
    isStringError,
} from '../../../../types';

const defaultGetUserCollectionsParams = {
    limit: 4,
};

export const getUserCollections = (builder: ApiBuilder) =>
    builder.query<UserCollections, CollectionsPreviewQuery>({
        query: (request) => ({
            url: Routes.Auth + Routes.GetUserCollections,
            params: { ...defaultGetUserCollectionsParams, ...request },
        }),
        serializeQueryArgs: ({ endpointName }) => endpointName,
        transformResponse: (response: CollectionPreview[]): UserCollections => ({
            collections: response,
            moreToFetch: response.length === defaultGetUserCollectionsParams.limit,
        }),
        merge: (currentCache, newCollections, { arg }) => {
            if (arg.page < 2)
                return {
                    collections: newCollections.collections,
                    moreToFetch: newCollections.moreToFetch,
                };
            return {
                collections: [...currentCache.collections, ...newCollections.collections],
                moreToFetch: newCollections.moreToFetch,
            };
        },
        forceRefetch: ({ currentArg, previousArg }) => {
            return (
                typeof currentArg !== typeof previousArg ||
                (!!currentArg &&
                    !!previousArg &&
                    !Object.values(currentArg).every(
                        (el, ind) => Object.values(previousArg)[ind] === el
                    ))
            );
        },
        keepUnusedDataFor: 0,
    });

export const findUserCollection = (builder: ApiBuilder) =>
    builder.query<CollectionPreview[], GetUserCollectionQuery>({
        query: (request) => ({
            url: Routes.Auth + Routes.GetUserCollection,
            params: request,
        }),
        keepUnusedDataFor: 0,
    });

export const getCollection = (builder: ApiBuilder) =>
    builder.query<CollectionResponse, string>({
        query: (collectionId) => ({
            url: Routes.GetCollection,
            params: { _id: collectionId } as GetCollectionQuery,
        }),
        providesTags: ['CurCollection'],
        keepUnusedDataFor: 0,
    });

export const newCollection = (builder: ApiBuilder) =>
    builder.mutation<NewCollectionRes, NewCollectionReq>({
        query: ({ ownerId, ...body }) => ({
            url: Routes.Auth + Routes.NewCollection,
            params: ownerId ? { ownerId } : undefined,
            method: 'POST',
            body,
        }),
    });

export const updateCollection = (builder: ApiBuilder) =>
    builder.mutation<string, UpdateCollectionReq>({
        query: (request) => ({
            url: Routes.Auth + Routes.UpdateCollection,
            method: 'PATCH',
            body: request,
        }),
        async onQueryStarted({ _id, ...request }, { dispatch, queryFulfilled }) {
            dispatch(
                api.util.updateQueryData('getCollection', _id, (draft) => {
                    Object.assign(draft, request);
                })
            );
            try {
                await queryFulfilled;
            } catch (error) {
                dispatch(api.util.invalidateTags(['CurCollection']));
                toast.error(
                    isStringError(error) ? error.data : 'Error connecting to server'
                );
            }
        },
    });

export const deleteCollection = (builder: ApiBuilder) =>
    builder.mutation<string, { collectionToDeleteId: string; userId?: string }>({
        query: ({ collectionToDeleteId }) => ({
            url: Routes.Auth + Routes.DeleteCollection,
            method: 'DELETE',
            body: { _id: collectionToDeleteId } as DeleteCollectionReq,
        }),
        async onQueryStarted(
            { collectionToDeleteId, userId },
            { dispatch, queryFulfilled }
        ) {
            const deleteResult = dispatch(
                api.util.updateQueryData(
                    'getUserCollections',
                    'getUserCollections' as unknown as CollectionsPreviewQuery,
                    (draft) => ({
                        ...draft,
                        collections: draft.collections.filter(
                            (collection) => collection._id !== collectionToDeleteId
                        ),
                    })
                )
            );
            const updateUserPage = dispatch(
                api.util.updateQueryData('getUserPage', userId, (draft) => ({
                    ...draft,
                    collections: draft.collections.filter(
                        (collection) => collection !== collectionToDeleteId
                    ),
                }))
            );
            try {
                await queryFulfilled;
            } catch (error) {
                deleteResult.undo();
                updateUserPage.undo();
                toast.error(
                    isStringError(error) ? error.data : 'Error connecting to server'
                );
            }
        },
    });
