import { ItemPreview } from '.';

export type ItemCollection = {
    name: string;
    description: string;
    theme: CollectionTheme;
    image?: string;
    authorName: string;
    format: FormatField[];
    items: string[];
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
    _id: string;
};

export type UpdateCollectionReq = {
    _id: string;
    name?: string;
    description?: string;
    theme?: CollectionTheme;
    image?: string;
};

export type DeleteCollectionReq = {
    _id: string;
};

export type CollectionResponse = Omit<ItemCollection, 'items'> & {
    _id: string;
    items: ItemPreview[];
};

export type CollectionPreview = Omit<CollectionResponse, 'format' | 'items'> & {
    itemNumber: number;
};
