import { Request, Response } from 'express';
import { CollectionModel, ItemModel } from '../../models';
import { getNameVersion } from '../../utils/nameVersioning';
import {
    authorizeCollectionOwnership,
    getItemPreview,
    setItemFields,
    updateTags,
} from './utils';
import { ItemPreview, NewItemReq, ResponseError } from '../../types';

export const newItem = async (req: Request, res: Response<ItemPreview>) => {
    const { name, parentCollectionId, tags, fields }: NewItemReq = req.body;

    const existingCollection = await CollectionModel.findById(
        parentCollectionId
    ).populate<{ items: { name: string }[] }>('items', 'name');
    if (!existingCollection)
        throw new ResponseError(
            `Collection with id ${parentCollectionId} not found`,
            404
        );

    authorizeCollectionOwnership(req, existingCollection._id);

    const formatTypes = existingCollection.format
        .map((formatEntry) => formatEntry.fieldType)
        .sort();

    const itemConformsToCollectionFormat = fields
        .map((genericField) => genericField.fieldType)
        .sort()
        .every((fieldType, ind) => fieldType === formatTypes[ind]);

    if (!itemConformsToCollectionFormat)
        throw new ResponseError(
            `Request's field formats are incompatible with the collection schema`,
            422
        );

    let validatedName = name;
    if (existingCollection.populated('items')) {
        validatedName = getNameVersion(
            validatedName,
            existingCollection.items.map((item) => item.name)
        );
    }

    await updateTags(tags);

    const newItem = new ItemModel({
        name: validatedName,
        parentCollection: existingCollection._id,
        tags,
    });
    setItemFields(newItem, fields);

    await newItem.save();

    existingCollection.items.push(newItem._id);
    await existingCollection.save();

    res.status(200).json(getItemPreview(newItem));
};
