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
    CollectionModelType,
    CollectionPreview,
} from '../../types';
import { largestCollections, latestItems, updatesRequired } from '../../data';

const ordering = ['stringFields', 'dateFields', 'booleanFields', 'numberFields'] as const;
export const getItemPreview = (
    item: Omit<ItemModelType, 'comments' | 'parentCollection'>,
    itemWithObjectPropsFromSearch = false,
    includeAllFields = false
): ItemPreview => {
    const previewFields: ItemResFormatField[] = [];
    if (includeAllFields) {
        [...ordering, 'textFields'].forEach((fieldType) => {
            const allFieldsOfCurType = itemWithObjectPropsFromSearch
                ? Object.entries(
                      item[fieldType] as {
                          [key: string]: string | boolean | number | Date;
                      }
                  )
                : Array.from(
                      (
                          item[fieldType] as Map<string, string | boolean | number | Date>
                      ).entries()
                  );
            allFieldsOfCurType.forEach(([key, value]) =>
                previewFields.push({ [key]: value })
            );
        });
    } else {
        main: for (const fieldType of ordering) {
            for (const [key, value] of itemWithObjectPropsFromSearch
                ? Object.entries(item[fieldType])
                : Array.from(
                      (
                          item[fieldType] as Map<string, string | boolean | number | Date>
                      ).entries()
                  )) {
                previewFields.push({ [key]: value });
                if (previewFields.length === 4) break main;
            }
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
    req: Request,
    itemWithObjectPropsFromSearch = false
): ItemResponse => {
    const requestingUser = req.user as UserModelType;
    const previewPart = getItemPreview(item, itemWithObjectPropsFromSearch, true);
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

export const getCollectionPreview = (
    collection: Omit<CollectionModelType, 'items'> & { items: unknown[] }
): CollectionPreview => ({
    _id: collection._id,
    name: collection.name,
    description: collection.description,
    theme: collection.theme,
    image: collection.image,
    authorName: collection.authorName,
    itemNumber: collection.items.length,
});

export const authorizeCommentEdit = (req: Request, authorId: Schema.Types.ObjectId) => {
    const editor = req.user as UserModelType;
    if (!editor.admin || !editor._id.equals(authorId))
        throw new ResponseError('Unauthorized', 401);
};

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

export const handleHomeOnDeleteUpdates = (
    field: 'latestItems' | 'largestCollections',
    checkId: Schema.Types.ObjectId
) => {
    const fieldToUpdate = field === 'latestItems' ? latestItems : largestCollections;
    const deletionInd = fieldToUpdate.findIndex((fieldItem) =>
        fieldItem._id.equals(checkId)
    );
    if (deletionInd !== -1) {
        fieldToUpdate.splice(deletionInd, 1);
        updatesRequired[field] = true;
    }
};
