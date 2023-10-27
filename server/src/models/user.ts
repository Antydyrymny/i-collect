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
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 1,
    },
    createdAt: {
        type: String,
        immutable: true,
        required: true,
        default: () => new Date().toISOString(),
    },
    lastLogin: {
        type: String,
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
            ref: 'Collections',
        },
    ],
});

export const UserModel = mongoose.model<UserModelType>('User', userSchema);
