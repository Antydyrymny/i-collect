import { Request, Response } from 'express';
import { CollectionModel, ItemModel } from '../../models';
import { getNameVersion } from '../../utils/nameVersioning';
import { getItemResponse, setItemFields, updateTags } from './utils';
import { UpdateItemReq, ItemResponse, ResponseError } from '../../types';
import { ObjectId } from 'mongoose';

export const updateItem = async (req: Request, res: Response<ItemResponse>) => {
    const {
        _id,
        name: newName,
        parentCollectionId,
        tags,
        fields,
    }: UpdateItemReq = req.body;

    const existingItem = await ItemModel.findById(_id).populate<{
        comments: { _id: ObjectId; author: ObjectId; content: string }[];
    }>('comments', 'author content');
    if (!existingItem) throw new ResponseError(`Item with id ${_id} not found`, 404);

    const existingCollection = newName
        ? await CollectionModel.findById(parentCollectionId).populate<{
              items: { name: string }[];
          }>('items', 'name')
        : await CollectionModel.findById(parentCollectionId);

    if (!existingCollection)
        throw new ResponseError(
            `Collection with id ${parentCollectionId} not found`,
            404
        );

    const itemConformsToCollectionFormat = fields.every(
        ({ fieldName: key, fieldType: type }) => {
            existingItem[type + 'Fields'].has(key);
        }
    );
    if (!itemConformsToCollectionFormat)
        throw new ResponseError(
            `Request's field formats are incompatible with the collection schema`,
            422
        );

    let validatedName = newName ?? existingItem.name;
    if (newName && existingCollection.populated('items')) {
        validatedName = getNameVersion(
            validatedName,
            (existingCollection.items as { name: string }[]).map((item) => item.name)
        );
    }

    await updateTags(tags);

    existingItem.name = validatedName;
    existingItem.tags = tags;
    setItemFields(existingItem, fields);

    await existingItem.save();

    res.status(200).json(
        getItemResponse(existingItem, existingCollection._id, existingCollection.name)
    );
};
