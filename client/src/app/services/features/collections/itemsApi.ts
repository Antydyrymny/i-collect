import api from '../../api';
import {
    ApiBuilder,
    DeleteItemReq,
    GetCollectionItemsQuery,
    GetItemQuery,
    ItemPreview,
    ItemResponse,
    NewItemReq,
    Routes,
    UpdateItemReq,
    isStringError,
} from '../../../../types';
import { toast } from 'react-toastify';

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
