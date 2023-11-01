import { Schema } from 'mongoose';

export type Comment = {
    author: Schema.Types.ObjectId;
    toItem: Schema.Types.ObjectId;
    itemModelName: string;
    content: string;
    likesBy: Schema.Types.ObjectId[];
};
