import { Schema } from 'mongoose';

export type Comment = {
    author: Schema.Types.ObjectId;
    toItem: Schema.Types.ObjectId;
    content: string;
};
