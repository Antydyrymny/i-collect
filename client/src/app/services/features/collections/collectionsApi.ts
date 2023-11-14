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
    limit: 3,
};

export const getUserCollections = (builder: ApiBuilder) =>
    builder.query<UserCollections, CollectionsPreviewQuery>({
        query: (request) => ({
            url: Routes.Auth + Routes.GetUserCollections,
            params: { ...defaultGetUserCollectionsParams, ...request },
        }),
        serializeQueryArgs: ({ endpointName }) => {
            return endpointName;
        },
        transformResponse: (response: CollectionPreview[]): UserCollections => {
            return {
                collections: response,
                moreToFetch: response.length === defaultGetUserCollectionsParams.limit,
            };
        },
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
        query: (request) => ({
            url: Routes.GetCollection,
            params: { _id: request } as GetCollectionQuery,
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
        query: ({ ownerId, ...body }) => ({
            url: Routes.Auth + Routes.UpdateCollection,
            params: ownerId ? { ownerId } : undefined,
            method: 'PATCH',
            body,
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
    builder.mutation<string, DeleteCollectionReq>({
        query: ({ ownerId, ...body }) => ({
            url: Routes.Auth + Routes.DeleteCollection,
            params: ownerId ? { ownerId } : undefined,
            method: 'DELETE',
            body,
        }),
        async onQueryStarted(request, { dispatch, queryFulfilled }) {
            const deleteResult = dispatch(
                api.util.updateQueryData(
                    'getUserCollections',
                    'getUserCollections' as unknown as CollectionsPreviewQuery,
                    (draft) => ({
                        ...draft,
                        collections: draft.collections.filter(
                            (collection) => collection._id !== request._id
                        ),
                    })
                )
            );
            try {
                await queryFulfilled;
            } catch (error) {
                deleteResult.undo();
                toast.error(
                    isStringError(error) ? error.data : 'Error connecting to server'
                );
            }
        },
    });
