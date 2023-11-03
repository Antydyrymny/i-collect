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
        default: new Map(),
    },
    numberFields: {
        type: Map,
        of: Number,
        default: new Map(),
    },
    stringFields: {
        type: Map,
        of: String,
        maxlength: 255,
        default: new Map(),
    },
    textFields: {
        type: Map,
        of: String,
        default: new Map(),
    },
    dateFields: {
        type: Map,
        of: Date,
        default: new Map(),
    },
});

export const ItemModel = mongoose.model<ItemModelType>(Models.Item, itemSchema);
