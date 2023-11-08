import {
    ApiBuilder,
    CommentRes,
    DeleteCommentReq,
    EditCommentReq,
    GetItemCommentsQuery,
    NewCommentReq,
    Routes,
} from '../../../../types';

const defaultGetItemCommentsParams = {
    limit: 10,
};

export const getItemComments = (builder: ApiBuilder) =>
    builder.query<CommentRes[], GetItemCommentsQuery>({
        query: (request) => ({
            url: Routes.GetItemComments,
            params: { ...defaultGetItemCommentsParams, ...request },
        }),
        serializeQueryArgs: ({ endpointName }) => {
            return endpointName;
        },
        merge: (currentCache, newComments) => {
            currentCache.push(...newComments);
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

export const newComment = (builder: ApiBuilder) =>
    builder.mutation<string, NewCommentReq>({
        query: (request) => ({
            url: Routes.Auth + Routes.NewComment,
            method: 'POST',
            body: request,
        }),
    });

export const editComment = (builder: ApiBuilder) =>
    builder.mutation<string, EditCommentReq>({
        query: (request) => ({
            url: Routes.Auth + Routes.EditComment,
            method: 'PATCH',
            body: request,
        }),
    });

export const deleteComment = (builder: ApiBuilder) =>
    builder.mutation<string, string>({
        query: (commentToDeleteId) => ({
            url: Routes.Auth + Routes.DeleteComment,
            method: 'DELETE',
            body: { _id: commentToDeleteId } as DeleteCommentReq,
        }),
    });
