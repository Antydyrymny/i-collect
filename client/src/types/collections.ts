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

export type NewCollectionReq = Omit<ItemCollection, 'items' | 'authorName'> & {
    authorId: string;
};
