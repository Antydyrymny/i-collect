import mongoose, { Schema } from 'mongoose';
import { Models, CommentModelType } from '../types';

const commentSchema = new mongoose.Schema<CommentModelType>({
    authorId: {
        type: Schema.Types.ObjectId,
        ref: Models.User,
        required: true,
    },
    authorName: {
        type: String,
        maxlength: 255,
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
    createdAt: {
        type: Date,
        immutable: true,
        default: () => new Date(),
    },
});

export const CommentModel = mongoose.model<CommentModelType>(
    Models.Comment,
    commentSchema
);
