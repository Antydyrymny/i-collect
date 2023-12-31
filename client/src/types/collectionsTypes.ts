import { AdminQuery } from '.';

export type ItemCollection = {
    name: string;
    description: string;
    theme: CollectionTheme;
    image?: string;
    authorId: string;
    authorName: string;
    format: FormatField[];
    items: string[];
};

export type FormatField = {
    fieldName: string;
    fieldType: FieldType;
};
export type EditedFormatField = { id: string; new: boolean } & FormatField;

export type FieldType = 'boolean' | 'number' | 'string' | 'text' | 'date';
export type FieldValueMap = {
    [K in FieldType]: K extends 'boolean'
        ? boolean
        : K extends 'number'
        ? number
        : K extends 'string' | 'text'
        ? string
        : K extends 'date'
        ? Date
        : never;
};

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

export type NewCollectionReq = Partial<AdminQuery> &
    Omit<ItemCollection, 'items' | 'authorId' | 'authorName' | 'image' | 'format'> & {
        image?: File;
        format: string;
    };

export type NewCollectionRes = {
    _id: string;
};

export type FormatFieldUpdate =
    | ({
          action: 'add';
      } & FormatField)
    | ({ action: 'rename' } & FormatField & { newName: string })
    | ({ action: 'delete' } & FormatField);

export type UpdateCollectionReq = {
    _id: string;
    name?: string;
    description?: string;
    theme?: CollectionTheme;
    image?: File;
    deleteImage?: true;
    format?: FormatFieldUpdate[];
};

export type DeleteCollectionReq = {
    _id: string;
};

export type CollectionsPreviewQuery = {
    ownerId?: string;
    page: number;
};

export type GetCollectionQuery = {
    _id: string;
};

export type GetUserCollectionQuery = {
    ownerId?: string;
    query: string;
};

export type CollectionResponse = Omit<ItemCollection, 'items'> & {
    _id: string;
    itemNumber: number;
};
export type CollectionPreview = Omit<CollectionResponse, 'format' | 'authorId'>;

export type UserCollections = {
    collections: CollectionPreview[];
    moreToFetch: boolean;
};
