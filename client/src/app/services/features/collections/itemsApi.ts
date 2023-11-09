import api from '../../api';
import { toast } from 'react-toastify';
import {
    ApiBuilder,
    DeleteItemReq,
    GetCollectionItemsQuery,
    GetItemQuery,
    ItemPreview,
    ItemResponse,
    NewItemReq,
    Routes,
    ToggleLikeItemReq,
    UpdateItemReq,
    isStringError,
} from '../../../../types';

const defaultGetCollectionItemsParams = {
    limit: 10,
};

export const getCollectionItems = (builder: ApiBuilder) =>
    builder.query<ItemPreview[], GetCollectionItemsQuery>({
        query: (request) => ({
            url: Routes.GetCollectionItems,
            params: { ...defaultGetCollectionItemsParams, ...request },
        }),
        serializeQueryArgs: ({ endpointName }) => {
            return endpointName;
        },
        merge: (currentCache, newItems) => {
            currentCache.push(...newItems);
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

export const getItem = (builder: ApiBuilder) =>
    builder.query<ItemResponse, string>({
        query: (itemId) => ({
            url: Routes.GetItem,
            params: { _id: itemId } as GetItemQuery,
        }),
        providesTags: ['CurItem'],
        keepUnusedDataFor: 0,
    });

export const newItem = (builder: ApiBuilder) =>
    builder.mutation<ItemPreview, NewItemReq>({
        query: (request) => ({
            url: Routes.Auth + Routes.NewItem,
            method: 'POST',
            body: request,
        }),
        async onQueryStarted(_request, { dispatch, queryFulfilled }) {
            try {
                const { data: newItemPreview } = await queryFulfilled;
                dispatch(
                    api.util.updateQueryData(
                        'getCollectionItems',
                        'getCollectionItems' as unknown as GetCollectionItemsQuery,
                        (draft) => [...draft, newItemPreview]
                    )
                );
            } catch (error) {
                toast.error(
                    isStringError(error) ? error.data : 'Error connecting to server'
                );
            }
        },
    });

export const updateItem = (builder: ApiBuilder) =>
    builder.mutation<ItemResponse, UpdateItemReq>({
        query: (request) => ({
            url: Routes.Auth + Routes.UpdateItem,
            method: 'PATCH',
            body: request,
        }),
        async onQueryStarted({ _id, ...request }, { dispatch, queryFulfilled }) {
            dispatch(
                api.util.updateQueryData('getItem', _id, (draft) => {
                    Object.assign(draft, request);
                })
            );
            try {
                await queryFulfilled;
            } catch (error) {
                dispatch(api.util.invalidateTags(['CurItem']));
                toast.error(
                    isStringError(error) ? error.data : 'Error connecting to server'
                );
            }
        },
    });

export const toggleLikeItem = (builder: ApiBuilder) =>
    builder.mutation<string, ToggleLikeItemReq>({
        query: (request) => ({
            url: Routes.Auth + Routes.ToggleLikeItem,
            method: 'PATCH',
            body: request,
        }),
        async onQueryStarted(request, { dispatch, queryFulfilled }) {
            const resultOnItemScreen = dispatch(
                api.util.updateQueryData('getItem', request._id, (draft) => ({
                    ...draft,
                    userLikes: request.action === 'like' ? true : false,
                }))
            );
            try {
                await queryFulfilled;
            } catch (error) {
                resultOnItemScreen.undo();
                toast.error(
                    isStringError(error) ? error.data : 'Error connecting to server'
                );
            }
        },
    });

export const deleteItem = (builder: ApiBuilder) =>
    builder.mutation<string, string>({
        query: (itemToDeleteId) => ({
            url: Routes.Auth + Routes.DeleteItem,
            method: 'DELETE',
            body: { _id: itemToDeleteId } as DeleteItemReq,
        }),
        async onQueryStarted(itemToDeleteId, { dispatch, queryFulfilled }) {
            const deleteResult = dispatch(
                api.util.updateQueryData(
                    'getCollectionItems',
                    'getCollectionItems' as unknown as GetCollectionItemsQuery,
                    (draft) => draft.filter((item) => item._id !== itemToDeleteId)
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
