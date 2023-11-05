export type Comment = {
    authorId: string;
    authorName: string;
    toItem: string;
    content: string;
};

export type NewCommentReq = Pick<Comment, 'content'> & {
    toItem: string;
};
export type EditCommentReq = Pick<Comment, 'content'> & {
    _id: string;
};
export type DeleteCommentReq = {
    _id: string;
};
export type GetItemCommentsQuery = {
    itemId: string;
    page: string;
    limit: string;
};

export type CommentRes = {
    _id: string;
    authorName: string;
    content: string;
};
