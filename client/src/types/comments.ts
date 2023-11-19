export type Comment = {
    authorId: string;
    authorName: string;
    toItem: string;
    content: string;
    createdAt: Date;
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
    page: number;
};

export type CommentRes = Omit<Comment, 'toItem'> & {
    _id: string;
};
export type ItemComments = {
    comments: CommentRes[];
    moreToFetch: boolean;
};
export type CommentUpdate = Pick<CommentRes, '_id' | 'content'>;
