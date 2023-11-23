import { Document } from 'mongoose';
import { User } from './usersTypes';
import { ItemCollection } from './collectionsTypes';
import { Item } from './itemsTypes';
import { Tag } from './tagsTypes';
import { Comment } from './commentsTypes';

export enum Models {
    User = 'users',
    Collection = 'collectionmodels',
    Item = 'items',
    Tag = 'tags',
    Comment = 'comments',
}

export enum Indexes {
    TagAutoComplete = 'tagAutocomplete',
    ItemFullTextSearch = 'itemFullTextSearch',
    CommentFullTextSearch = 'commentFullTextSearch',
    CollectionText = 'collectionText',
    UserAutocomplete = 'userAutocomplete',
}

export type UserModelType = User & Document;
export type CollectionModelType = ItemCollection & Document;
export type ItemModelType = Item & Document;
export type TagModelType = Tag & Document;
export type CommentModelType = Comment & Document;
