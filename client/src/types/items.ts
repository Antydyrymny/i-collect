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
export type UpdateItemReq = ItemReq & {
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
    page: string;
    limit: string;
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
    likesFrom: string[];
    fields: ItemResFormatField[];
};

export type ItemPreview = {
    _id: string;
    name: string;
    tags: string[];
    likesNumber: number;
    fields: ItemResFormatField[];
};
