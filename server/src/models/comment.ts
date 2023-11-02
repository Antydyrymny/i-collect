import mongoose, { Schema } from 'mongoose';
import { Models, CommentModelType } from '../types';

const commentSchema = new mongoose.Schema<CommentModelType>({
    author: {
        type: Schema.Types.ObjectId,
        ref: Models.User,
        required: true,
    },
    toItem: {
        type: Schema.Types.ObjectId,
        ref: Models.Item,
        required: true,
    },
    content: {
        type: String,
        minlength: 1,
        required: true,
    },
});

export const CommentModel = mongoose.model<CommentModelType>(
    Models.Comment,
    commentSchema
);
