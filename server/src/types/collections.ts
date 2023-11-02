import { Schema } from 'mongoose';

export type ItemCollection = {
    name: string;
    description: string;
    theme: CollectionTheme;
    image?: string;
    author: Schema.Types.ObjectId;
    format: FormatField[];
    itemModels: [Schema.Types.ObjectId];
};

export type FormatField = {
    fieldType: FieldType;
    fieldName: string;
};
export type FieldType = 'boolean' | 'number' | 'string' | 'text' | 'date';
export type CollectionTheme =
    | 'Books'
    | 'Signs'
    | 'Films'
    | 'Stamps'
    | 'Coins'
    | 'Comics'
    | 'Cards'
    | 'Cars'
    | 'Art'
    | 'Other';

export type NewCollectionReq = Omit<ItemCollection, 'itemModelName' | 'authorId'> & {
    authorId: string;
};
