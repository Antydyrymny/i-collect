import { Schema } from 'mongoose';
import { FormatField } from './collections';

export type Item = {
    name: string;
    parentCollection: Schema.Types.ObjectId;
    tags: Schema.Types.ObjectId[];
    comments: Schema.Types.ObjectId[];
    likesFrom: Schema.Types.ObjectId[];
    booleanFields: Map<string, boolean>;
    numberFields: Map<string, number>;
    stringFields: Map<string, string>;
    textFields: Map<string, string>;
    dateFields: Map<string, Date>;
};

export type NewItemReq = {
    name: string;
    parentCollection: string;
    tags: string[];
    format: FormatField[];
};
