import { Schema } from 'mongoose';
import { ItemPreview } from './items';

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

export type NewCollectionReq = Omit<ItemCollection, 'items' | 'authorName'>;
export type NewCollectionRes = {
    id: string;
};

export type UpdateCollectionReq = {
    id: string;
    name?: string;
    description?: string;
    theme?: CollectionTheme;
    image?: string;
};

export type DeleteCOllectionReq = {
    id: string;
};

export type CollectionResponse = Omit<ItemCollection, 'items'> & {
    _id: string;
    items: ItemPreview[];
};

export type CollectionPreview = Omit<CollectionResponse, 'format' | 'items'> & {
    itemNumber: number;
};
