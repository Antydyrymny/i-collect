import { Document } from 'mongoose';
import { User } from './users';
import { Comment } from './comments';
import { ItemCollection } from './collections';

export enum Models {
    User = 'User',
    Collection = 'CollectionModel',
    Comment = 'Comment',
}

export type UserModelType = User & Document;
export type CollectionModelType = ItemCollection & Document;
export type CommentModelType = Comment & Document;
