import { FormatField } from '.';

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
    page: number;
};
export type FindCollectionItemQuery = {
    collectionId: string;
    query: string;
};
export type GetItemQuery = {
    _id: string;
    userId?: string;
};

export type ItemResponse = {
    _id: string;
    authorId: string;
    name: string;
    parentCollection: {
        _id: string;
        name: string;
    };
    tags: string[];
    userLikes: boolean;
    likesNumber: number;
    fields: ItemFormatField[];
};

export type ItemPreview = {
    _id: string;
    name: string;
    tags: string[];
    likesNumber: number;
    fields: ItemFormatField[];
};
export type CollectionItems = { items: ItemPreview[]; moreToFetch: boolean };
