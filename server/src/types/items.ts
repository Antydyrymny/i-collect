import { Schema } from 'mongoose';

export type Item = {
    name: string;
    parentCollection: Schema.Types.ObjectId;
    tags: [Schema.Types.ObjectId];
    comments: [Schema.Types.ObjectId];
    likesFrom: [Schema.Types.ObjectId];
    booleanFields: Map<string, boolean>;
    numberFields: Map<string, number>;
    stringFields: Map<string, string>;
    textFields: Map<string, string>;
    dateFields: Map<string, Date>;
};
