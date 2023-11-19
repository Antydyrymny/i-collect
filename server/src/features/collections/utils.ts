import dotenv from 'dotenv';
import { Request } from 'express';
import { ObjectId, Schema } from 'mongoose';
import { CommentModel, ItemModel, TagModel } from '../../models';
import { largestCollections, latestItems, updatesRequired } from '../../data';
import {
    ItemModelType,
    ItemPreview,
    ItemFormatField,
    ItemResponse,
    ResponseError,
    CollectionModelType,
    CollectionPreview,
    AuthUser,
    Indexes,
    CommentRes,
    CommentModelType,
} from '../../types';

dotenv.config();

const maxPreviewFields = +process.env.MAX_ITEM_PREVIEW_FIELDS;
const previewFields = ['string', 'date'] as const;
const allFields = [...previewFields, 'text', 'number', 'boolean'] as const;

export const getItemPreview = (
    item: Omit<ItemModelType, 'comments' | 'parentCollection'>,
    itemWithObjectPropsFromSearch = false,
    includeAllFields = false
): ItemPreview => {
    const returnedFields: ItemFormatField[] = [];
    if (includeAllFields) {
        allFields.forEach((type) => {
            const fieldType = type + 'Fields';
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
                returnedFields.push({
                    fieldType: type,
                    fieldName: key,
                    fieldValue: value,
                })
            );
        });
    } else {
        main: for (const type of previewFields) {
            const fieldType = type + 'Fields';
            for (const [key, value] of itemWithObjectPropsFromSearch
                ? Object.entries(
                      item[fieldType] as {
                          [key: string]: string | Date;
                      }
                  )
                : Array.from((item[fieldType] as Map<string, string | Date>).entries())) {
                returnedFields.push({
                    fieldType: type,
                    fieldName: key,
                    fieldValue: value,
                });
                if (previewFields.length === maxPreviewFields) break main;
            }
        }
    }

    return {
        _id: item._id,
        name: item.name,
        tags: item.tags,
        likesNumber: item.likesFrom.length,
        fields: returnedFields,
    };
};

export const getItemResponse = (
    item: Omit<ItemModelType, 'comments' | 'parentCollection'>,
    parentCollectionId: ObjectId,
    parentCollectionName: string,
    userId?: string,
    itemWithObjectPropsFromSearch = false
): ItemResponse => {
    const previewPart = getItemPreview(item, itemWithObjectPropsFromSearch, true);
    return {
        ...previewPart,
        authorId: item.authorId,
        parentCollection: {
            _id: parentCollectionId,
            name: parentCollectionName,
        },
        userLikes: userId
            ? item.likesFrom.some((likeAuthorId) => userId === likeAuthorId.toString())
            : false,
    };
};

export const setItemFields = (
    item: Omit<ItemModelType, 'comments'>,
    fields: ItemFormatField[]
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
    const editor = req.user as AuthUser;
    if (!editor.admin || editor._id !== authorId.toString())
        throw new ResponseError('Unauthorized', 401);
};

export const authorizeCollectionOwnership = (
    req: Request,
    collectionAuthor: Schema.Types.ObjectId
) => {
    const requestingUser = req.user as AuthUser;
    if (requestingUser.admin) return;

    if (requestingUser._id !== collectionAuthor.toString())
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

export const itemSearch = async (
    query: string,
    fromCollectionItems?: Schema.Types.ObjectId[],
    limit = 10
) => {
    if (!query || typeof query !== 'string') {
        return [];
    }

    const addSortScoreAndSort = [
        {
            $addFields: {
                score: { $meta: 'searchScore' },
            },
        },
        {
            $sort: { score: -1 },
        },
    ];

    const itemPipeline = [];
    itemPipeline.push({
        $search: {
            index: Indexes.ItemFullTextSearch,
            text: {
                query: query,
                path: [
                    'name',
                    'tags',
                    { wildcard: 'stringFields.*' },
                    { wildcard: 'textFields.*' },
                ],
                fuzzy: { maxEdits: 1 },
            },
        },
    });
    if (fromCollectionItems) {
        itemPipeline.push({
            $match: {
                _id: { $in: fromCollectionItems },
            },
        });
    }
    itemPipeline.push(...addSortScoreAndSort);

    const commentPipeLine = [];
    commentPipeLine.push({
        $search: {
            index: Indexes.CommentFullTextSearch,
            text: {
                query: query,
                path: 'content',
                fuzzy: { maxEdits: 1 },
            },
        },
    });
    if (fromCollectionItems) {
        commentPipeLine.push({
            $match: {
                toItem: { $in: fromCollectionItems },
            },
        });
    }
    commentPipeLine.push(...addSortScoreAndSort);

    try {
        const [items, comments] = await Promise.all([
            ItemModel.aggregate(itemPipeline).limit(limit),
            CommentModel.aggregate(commentPipeLine).limit(limit),
        ]);

        const commentsToInclude = comments.filter((comment) =>
            items.every((item) => !item._id.equals(comment._id))
        );
        const commentsItems = await Promise.all(
            commentsToInclude.map((comment) => ItemModel.findById(comment.toItem))
        );

        return [...items, ...commentsToInclude]
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map((searchRes) =>
                searchRes.toItem
                    ? getItemPreview(
                          commentsItems.find((item) => item._id.equals(searchRes.toItem))
                      )
                    : getItemPreview(searchRes, true)
            );
    } catch (error) {
        console.log(`Item search failed with error: ${error.message}`);
        return [];
    }
};

export const getCommentResponse = (comment: CommentModelType): CommentRes => ({
    _id: comment._id,
    authorId: comment.authorId,
    authorName: comment.authorName,
    content: comment.content,
    createdAt: comment.createdAt,
});
