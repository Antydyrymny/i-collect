import { Schema } from 'mongoose';
import { Comment } from './comments';
import { FormatField } from './collections';

export type Item = {
    name: string;
    parentCollection: Schema.Types.ObjectId;
    tags: string[];
    comments: Schema.Types.ObjectId[];
    likesFrom: Schema.Types.ObjectId[];
    booleanFields: Map<string, boolean>;
    numberFields: Map<string, number>;
    stringFields: Map<string, string>;
    textFields: Map<string, string>;
    dateFields: Map<string, Date>;
};

export type ItemReqFormatField = FormatField & {
    fieldValue: boolean | number | string | Date;
};
export type ItemResFormatField = {
    [key: string]: boolean | number | string | Date;
};

export type ItemReq = {
    parentCollectionId: string;
    tags: string[];
    fields: ItemReqFormatField[];
};

export type NewItemReq = ItemReq & {
    name: string;
};
export type UpdateItemReq = ItemReq & {
    _id: string;
    name?: string;
};

export type ItemResponse = {
    _id: string;
    name: string;
    parentCollection: {
        _id: Schema.Types.ObjectId;
        name: string;
    };
    tags: string[];
    comments: (Pick<Comment, 'author' | 'content'> & { _id: Schema.Types.ObjectId })[];
    likesFrom: Schema.Types.ObjectId[];
    fields: ItemResFormatField[];
};

export type ItemPreview = {
    _id: string;
    name: string;
    tags: string[];
    likesNumber: number;
    fields: ItemResFormatField[];
};
