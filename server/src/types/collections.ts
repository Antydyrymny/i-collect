import { Schema } from 'mongoose';

export type ItemCollection = {
    name: string;
    description: string;
    theme: CollectionTheme;
    image?: string;
    authorName: string;
    format: FormatField[];
    items: Schema.Types.ObjectId[];
};

export type FormatField = {
    fieldName: string;
    fieldType: FieldType;
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

export type NewCollectionReq = Omit<ItemCollection, 'items' | 'authorName'> & {
    authorId: string;
};

export type UpdateCollectionReq = {
    id: string;
    authorId: string;
    name?: string;
    description?: string;
    theme?: CollectionTheme;
    image?: string;
};

export type DeleteCOllectionReq = {
    id: string;
    authorId: string;
};
