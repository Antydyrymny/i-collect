import { Schema } from 'mongoose';

export type Comment = {
    authorId: Schema.Types.ObjectId;
    authorName: string;
    toItem: Schema.Types.ObjectId;
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
