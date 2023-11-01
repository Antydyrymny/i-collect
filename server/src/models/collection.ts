import mongoose, { Schema } from 'mongoose';
import { Models, CollectionModelType, FormatField } from '../types';

const FormatFieldSchema = new mongoose.Schema<FormatField>({
    fieldName: {
        type: String,
        maxlength: 255,
        required: true,
    },
    fieldType: {
        type: String,
        enum: ['Boolean', 'Number', 'String', 'Text', 'Date'],
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
        required: true,
        default: '',
    },
    theme: {
        type: String,
        enum: ['Books', 'Signs', 'Films', 'Other'],
        default: 'Other',
        required: true,
    },
    image: {
        type: String,
        maxlength: 255,
        required: false,
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: Models.User,
        required: true,
    },
    format: [FormatFieldSchema],
    itemModelName: {
        type: String,
        maxlength: 255,
        required: true,
    },
});

export const CollectionModel = mongoose.model<CollectionModelType>(
    Models.Collection,
    collectionSchema
);
