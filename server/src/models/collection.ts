import mongoose, { Schema } from 'mongoose';
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
    authorName: {
        type: String,
        maxlength: 255,
    },
    format: [formatFieldSchema],
    items: [
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
