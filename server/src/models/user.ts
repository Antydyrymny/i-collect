import mongoose, { Schema, Document } from 'mongoose';
import type { User } from '../types';

export type UserModelType = User & Document;

const userSchema = new mongoose.Schema<UserModelType>({
    admin: {
        type: Boolean,
        required: true,
        default: false,
    },
    name: {
        type: String,
        maxlength: 255,
        required: true,
    },
    email: {
        type: String,
        maxlength: 255,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 255,
        required: true,
    },
    createdAt: {
        type: Date,
        immutable: true,
        required: true,
        default: () => new Date(),
    },
    lastLogin: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['online', 'offline', 'blocked'],
        required: true,
    },
    collectionIds: [
        {
            type: Schema.Types.ObjectId,
            ref: 'CollectionModel',
        },
    ],
});

export const UserModel = mongoose.model<UserModelType>('User', userSchema);
