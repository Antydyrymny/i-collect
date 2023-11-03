import mongoose, { Schema } from 'mongoose';
import { Models, ItemModelType } from '../types';

const itemSchema = new mongoose.Schema<ItemModelType>({
    name: {
        type: String,
        required: true,
    },
    parentCollection: {
        type: Schema.Types.ObjectId,
        ref: Models.Collection,
        required: true,
    },
    tags: [
        {
            type: String,
            maxlength: 255,
        },
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: Models.Comment,
        },
    ],
    likesFrom: [
        {
            type: Schema.Types.ObjectId,
            ref: Models.User,
        },
    ],
    booleanFields: {
        type: Map,
        of: Boolean,
    },
    numberFields: {
        type: Map,
        of: Number,
    },
    stringFields: {
        type: Map,
        of: String,
        maxlength: 255,
    },
    textFields: {
        type: Map,
        of: String,
    },
    dateFields: {
        type: Map,
        of: Date,
    },
});

export const ItemModel = mongoose.model<ItemModelType>(Models.Item, itemSchema);
