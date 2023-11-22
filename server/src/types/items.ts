import { Schema } from 'mongoose';
import { FormatField } from './collections';

export type Item = {
    name: string;
    authorId: Schema.Types.ObjectId;
    parentCollection: Schema.Types.ObjectId;
    createdAt: Date;
    tags: string[];
    comments: Schema.Types.ObjectId[];
    likesFrom: Schema.Types.ObjectId[];
    booleanFields: Map<string, boolean>;
    numberFields: Map<string, number>;
    stringFields: Map<string, string>;
    textFields: Map<string, string>;
    dateFields: Map<string, Date>;
};

export type ItemFormatField = FormatField & {
    fieldValue: boolean | number | string | Date;
};
export type ItemReq = {
    tags: string[];
    fields: ItemFormatField[];
};

export type NewItemReq = ItemReq & {
    name: string;
    parentCollectionId: string;
};
export type NewItemRes = {
    _id: string;
};

export type UpdateItemReq = Omit<ItemReq, 'fields'> &
    Partial<Pick<ItemReq, 'fields'>> & {
        _id: string;
        name?: string;
    };
export type DeleteItemReq = {
    _id: string;
};
export type ToggleLikeItemReq = {
    _id: string;
    action: 'like' | 'dislike';
};

export type GetCollectionItemsQuery = {
    collectionId: string;
    page: string;
    limit: string;
};
export type FindCollectionItemQuery = {
    collectionId: string;
    query: string;
};
export type GetItemQuery = {
    _id: string;
    userId?: string;
};

export type ItemPreview = {
    _id: string;
    name: string;
    tags: string[];
    likesNumber: number;
    fields: ItemFormatField[];
};
export type ItemResponse = ItemPreview & {
    parentCollection: {
        _id: Schema.Types.ObjectId;
        name: string;
    };
    userLikes: boolean;
    authorId: Schema.Types.ObjectId;
};
