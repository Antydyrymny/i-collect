import mongoose, { Schema, Document } from 'mongoose';
import { Comment } from '../types';

export type CommentModelType = Comment & Document;

const commentSchema = new mongoose.Schema<CommentModelType>({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    toItem: {
        type: Schema.Types.ObjectId,
        refPath: 'itemModelName',
        required: true,
    },
    itemModelName: {
        type: String,
        maxlength: 255,
        required: true,
    },
    content: {
        type: String,
        minlength: 1,
        required: true,
    },
    likesBy: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
});

export const CommentModel = mongoose.model<CommentModelType>('Comment', commentSchema);
