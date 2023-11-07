import api from '../../api';
import {
    AdminQuery,
    ApiBuilder,
    // CollectionPreview,
    CollectionResponse,
    // CollectionsPreviewQuery,
    GetCollectionQuery,
    NewCollectionReq,
    NewCollectionRes,
    Routes,
    UpdateCollectionReq,
} from '../../../../types';

// export const getUserCollections = (builder: ApiBuilder) =>
//     builder.query<CollectionPreview[], CollectionsPreviewQuery>();

export const getCollection = (builder: ApiBuilder) =>
    builder.query<CollectionResponse, string>({
        query: (request) => ({
            url: Routes.GetCollection,
            params: { _id: request } as GetCollectionQuery,
        }),
        providesTags: ['CurCollection'],
    });

export const newCollection = (builder: ApiBuilder) =>
    builder.mutation<NewCollectionRes, NewCollectionReq & Partial<AdminQuery>>({
        query: ({ ownerId, ...body }) => ({
            url: Routes.Auth + Routes.NewCollection,
            params: ownerId ? { ownerId } : undefined,
            method: 'POST',
            body,
        }),
    });

export const updateCollection = (builder: ApiBuilder) =>
    builder.mutation<string, UpdateCollectionReq & Partial<AdminQuery>>({
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
            } catch {
                dispatch(api.util.invalidateTags(['CurCollection']));
            }
        },
    });

// export const deleteCollection = (builder: ApiBuilder) => builder.mutation
