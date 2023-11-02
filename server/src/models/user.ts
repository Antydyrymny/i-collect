import mongoose, { Schema } from 'mongoose';
import { Models, UserModelType } from '../types';

const userSchema = new mongoose.Schema<UserModelType>({
    admin: {
        type: Boolean,
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
        default: () => new Date(),
    },
    lastLogin: {
        type: Date,
        default: () => new Date(),
    },
    status: {
        type: String,
        enum: ['online', 'offline', 'blocked'],
        default: 'online',
    },
    collections: [
        {
            type: Schema.Types.ObjectId,
            ref: Models.Collection,
        },
    ],
});

export const UserModel = mongoose.model<UserModelType>(Models.User, userSchema);
