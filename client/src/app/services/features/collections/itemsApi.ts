import api from '../../api';
import { toast } from 'react-toastify';
import {
    ApiBuilder,
    CollectionItems,
    DeleteItemReq,
    FindCollectionItemQuery,
    GetCollectionItemsQuery,
    GetItemQuery,
    ItemPreview,
    ItemResponse,
    NewItemReq,
    NewItemRes,
    Routes,
    ToggleLikeItemReq,
    UpdateItemReq,
    isStringError,
} from '../../../../types';

const defaultGetCollectionItemsParams = {
    limit: 10,
};

export const getCollectionItems = (builder: ApiBuilder) =>
    builder.query<CollectionItems, GetCollectionItemsQuery>({
        query: (request) => ({
            url: Routes.GetCollectionItems,
            params: { ...defaultGetCollectionItemsParams, ...request },
        }),
        serializeQueryArgs: ({ endpointName }) => endpointName,
        transformResponse: (response: ItemPreview[]): CollectionItems => ({
            items: response,
            moreToFetch: response.length === defaultGetCollectionItemsParams.limit,
        }),
        merge: (currentCache, newItems, { arg }) => {
            if (arg.page < 2)
                return { items: newItems.items, moreToFetch: newItems.moreToFetch };
            return {
                items: [...currentCache.items, ...newItems.items],
                moreToFetch: newItems.moreToFetch,
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

export const findCollectionItems = (builder: ApiBuilder) =>
    builder.query<ItemPreview[], FindCollectionItemQuery>({
        query: (request) => ({
            url: Routes.FindCollectionItems,
            params: request,
        }),
        keepUnusedDataFor: 0,
    });

export const getItem = (builder: ApiBuilder) =>
    builder.query<ItemResponse, GetItemQuery>({
        query: (request) => ({
            url: Routes.GetItem,
            params: request,
        }),
        serializeQueryArgs: ({ queryArgs }) => queryArgs._id ?? queryArgs,
        providesTags: ['CurItem'],
        keepUnusedDataFor: 0,
    });

export const newItem = (builder: ApiBuilder) =>
    builder.mutation<NewItemRes, NewItemReq>({
        query: (request) => ({
            url: Routes.Auth + Routes.NewItem,
            method: 'POST',
            body: request,
        }),
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
                api.util.updateQueryData(
                    'getItem',
                    _id as unknown as GetItemQuery,
                    (draft) => ({
                        ...draft,
                        name: request.name ?? draft.name,
                        tags: request.tags,
                        fields: !request.fields
                            ? draft.fields
                            : draft.fields.map((field) => {
                                  const updatedInd = request.fields?.findIndex(
                                      ({ fieldName }) => {
                                          field.fieldName === fieldName;
                                      }
                                  );
                                  return !!updatedInd && updatedInd !== -1
                                      ? {
                                            ...field,
                                            fieldValue:
                                                request.fields![updatedInd].fieldValue,
                                        }
                                      : field;
                              }),
                    })
                )
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
                api.util.updateQueryData(
                    'getItem',
                    request._id as unknown as GetItemQuery,
                    (draft) => ({
                        ...draft,
                        userLikes: request.action === 'like' ? true : false,
                    })
                )
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
    builder.mutation<string, { itemToDeleteId: string; collectionId?: string }>({
        query: ({ itemToDeleteId }) => ({
            url: Routes.Auth + Routes.DeleteItem,
            method: 'DELETE',
            body: { _id: itemToDeleteId } as DeleteItemReq,
        }),
        async onQueryStarted(
            { itemToDeleteId, collectionId },
            { dispatch, queryFulfilled }
        ) {
            const deleteResult = dispatch(
                api.util.updateQueryData(
                    'getCollectionItems',
                    'getCollectionItems' as unknown as GetCollectionItemsQuery,
                    (draft) => ({
                        ...draft,
                        items: draft.items.filter((item) => item._id !== itemToDeleteId),
                    })
                )
            );
            let updateCollectionPage = null;
            if (collectionId) {
                updateCollectionPage = dispatch(
                    api.util.updateQueryData('getCollection', collectionId, (draft) => ({
                        ...draft,
                        itemNumber: draft.itemNumber - 1,
                    }))
                );
            }
            try {
                await queryFulfilled;
            } catch (error) {
                deleteResult.undo();
                if (updateCollectionPage) updateCollectionPage.undo();
                toast.error(
                    isStringError(error) ? error.data : 'Error connecting to server'
                );
            }
        },
    });
