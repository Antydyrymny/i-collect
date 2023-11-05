import { Document } from 'mongoose';
import { User } from './users';
import { ItemCollection } from './collections';
import { Item } from './items';
import { Tag } from './tags';
import { Comment } from './comments';

export enum Models {
    User = 'users',
    Collection = 'collectionmodels',
    Item = 'items',
    Tag = 'tags',
    Comment = 'comments',
}

export enum Indexes {
    UserAutocomplete = 'userAutocomplete',
    TagAutoComplete = 'tagAutocomplete',
    ItemFuzzySearch = 'itemFuzzySearch',
}

export type UserModelType = User & Document;
export type CollectionModelType = ItemCollection & Document;
export type ItemModelType = Item & Document;
export type TagModelType = Tag & Document;
export type CommentModelType = Comment & Document;
