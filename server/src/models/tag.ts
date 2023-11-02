import mongoose from 'mongoose';
import { Models, TagModelType } from '../types';

const tagSchema = new mongoose.Schema<TagModelType>({
    name: {
        type: String,
        maxlength: 255,
        required: true,
    },
});

export const TagModel = mongoose.model<TagModelType>(Models.Tag, tagSchema);
