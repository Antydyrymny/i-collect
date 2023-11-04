export type Comment = {
    authorId: string;
    authorName: string;
    toItem: string;
    content: string;
};

export type NewCommentReq = Pick<Comment, 'content'> & {
    toItem: string;
};
