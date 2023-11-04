import { Request } from 'express';
import { ObjectId, Schema, Types } from 'mongoose';
import { TagModel } from '../../models';
import {
    ItemResFormatField,
    ItemModelType,
    ItemPreview,
    ItemReqFormatField,
    ItemResponse,
    UserModelType,
    ResponseError,
} from '../../types';

export const authorizeCollectionOwnership = (
    req: Request,
    collectionId: Types.ObjectId
) => {
    const requestingUser = req.user as UserModelType;
    if (requestingUser.admin) return;

    if (
        !requestingUser.collections.some((collection) =>
            collectionId.equals(collection as unknown as string)
        )
    )
        throw new ResponseError('Unauthorized', 401);
};

export const getItemPreview = (item: Omit<ItemModelType, 'comments'>): ItemPreview => {
    const previewFields: ItemResFormatField[] = [];
    const ordering = [
        'stringFields',
        'dateFields',
        'booleanFields',
        'numberFields',
    ] as const;
    main: for (const fieldType of ordering) {
        for (const [key, value] of Array.from(
            (item[fieldType] as Map<string, boolean | number | Date>).entries()
        )) {
            previewFields.push({ [key]: value });
            if (previewFields.length === 4) break main;
        }
    }

    return {
        _id: item._id,
        name: item.name,
        tags: item.tags,
        likesNumber: item.likesFrom.length,
        fields: previewFields,
    };
};

export const getItemResponse = (
    populatedItem: Omit<ItemModelType, 'comments'> & {
        comments: { _id: ObjectId; authorName: string; content: string }[];
    },
    parentCollectionId: ObjectId,
    parentCollectionName: string
): ItemResponse => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { likesNumber, ...previewPart } = getItemPreview(populatedItem);
    return {
        ...previewPart,
        parentCollection: {
            _id: parentCollectionId,
            name: parentCollectionName,
        },
        comments: populatedItem.comments,
        likesFrom: populatedItem.likesFrom,
    };
};

export const setItemFields = (
    item: Omit<ItemModelType, 'comments'>,
    fields: ItemReqFormatField[]
) => {
    fields.forEach(({ fieldName: key, fieldValue: val, fieldType: type }) => {
        item[type + 'Fields'].set(key, type === 'date' ? new Date(val as string) : val);
    });
};

export const updateTags = async (tags: string[]) => {
    await Promise.all(
        tags.map(async (tagName) => {
            const existingTag = await TagModel.findOne({ name: tagName });
            if (!existingTag) await TagModel.create({ name: tagName });
        })
    );
};

export const authorizeCommentEdit = (req: Request, authorId: Schema.Types.ObjectId) => {
    const editor = req.user as UserModelType;
    if (!editor.admin || !editor._id.equals(authorId))
        throw new ResponseError('Unauthorized', 401);
};
