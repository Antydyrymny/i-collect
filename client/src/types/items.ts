import { Comment, FormatField } from '.';

export type ItemReqFormatField = FormatField & {
    fieldValue: boolean | number | string | Date;
};
export type ItemResFormatField = {
    [key: string]: boolean | number | string | Date;
};

export type ItemReq = {
    parentCollectionId: string;
    tags: string[];
    fields: ItemReqFormatField[];
};

export type NewItemReq = ItemReq & {
    name: string;
};
export type UpdateItemReq = ItemReq & {
    _id: string;
    name?: string;
};

export type ItemResponse = {
    _id: string;
    name: string;
    parentCollection: {
        _id: string;
        name: string;
    };
    tags: string[];
    comments: Pick<Comment, 'author' | 'content'> & { _id: string }[];
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
