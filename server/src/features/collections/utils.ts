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

const ordering = ['stringFields', 'dateFields', 'booleanFields', 'numberFields'] as const;
export const getItemPreview = (
    item: Omit<ItemModelType, 'comments' | 'parentCollection'>
): ItemPreview => {
    const previewFields: ItemResFormatField[] = [];
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
    item: Omit<ItemModelType, 'comments' | 'parentCollection'>,
    parentCollectionId: ObjectId,
    parentCollectionName: string,
    req: Request
): ItemResponse => {
    const requestingUser = req.user as UserModelType;
    const previewPart = getItemPreview(item);
    return {
        ...previewPart,
        authorId: item.authorId,
        parentCollection: {
            _id: parentCollectionId,
            name: parentCollectionName,
        },
        userLikes: requestingUser
            ? item.likesFrom.some((likeAuthorId) =>
                  requestingUser._id.equals(likeAuthorId)
              )
            : false,
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
