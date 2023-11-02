import mongoose, { Schema, Types } from 'mongoose';
import { Models, CollectionModelType, FormatField } from '../types';

const formatFieldSchema = new mongoose.Schema<FormatField>({
    fieldName: {
        type: String,
        maxlength: 255,
        required: true,
    },
    fieldType: {
        type: String,
        enum: ['boolean', 'number', 'string', 'text', 'date'],
        required: true,
    },
});

const collectionSchema = new mongoose.Schema<CollectionModelType>({
    name: {
        type: String,
        maxlength: 255,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    theme: {
        type: String,
        enum: [
            'Books',
            'Signs',
            'Films',
            'Stamps',
            'Coins',
            'Comics',
            'Cards',
            'Cars',
            'Art',
            'Other',
        ],
        default: 'Other',
    },
    image: {
        type: String,
        maxlength: 255,
        required: false,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: Models.User,
        required: true,
        set: function (author: string) {
            return new Types.ObjectId(author);
        },
    },
    format: [formatFieldSchema],
    itemModels: [
        {
            type: Schema.Types.ObjectId,
            ref: Models.Item,
        },
    ],
});

export const CollectionModel = mongoose.model<CollectionModelType>(
    Models.Collection,
    collectionSchema
);
