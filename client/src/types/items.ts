import { FormatField } from '.';

export type ItemReqFormatField = FormatField & {
    fieldValue: boolean | number | string | Date;
};
export type ItemResFormatField = {
    [key: string]: boolean | number | string | Date;
};

export type ItemReq = {
    tags: string[];
    fields: ItemReqFormatField[];
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
    fields: ItemResFormatField[];
};

export type ItemPreview = {
    _id: string;
    name: string;
    tags: string[];
    likesNumber: number;
    fields: ItemResFormatField[];
};
export type CollectionItems = { items: ItemPreview[]; moreToFetch: boolean };
