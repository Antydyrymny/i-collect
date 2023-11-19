import { Request, Response } from 'express';
import { CollectionModel, ItemModel } from '../../../models';
import { getNameVersion } from '../../../utils/nameVersioning';
import {
    authorizeCollectionOwnership,
    getCollectionPreview,
    getItemPreview,
    setItemFields,
    updateTags,
} from '../utils';
import { NewItemReq, NewItemRes, ResponseError } from '../../../types';
import {
    largestCollections,
    largestCollectionsLimit,
    latestItems,
    latestItemsLimit,
    updatesRequired,
} from '../../../data';

export const newItem = async (req: Request, res: Response<NewItemRes>) => {
    const { name, parentCollectionId, tags = [], fields = [] }: NewItemReq = req.body;

    const existingCollection = await CollectionModel.findById(
        parentCollectionId
    ).populate<{ items: { name: string }[] }>('items', 'name');
    if (!existingCollection)
        throw new ResponseError(
            `Collection with id ${parentCollectionId} not found`,
            404
        );

    authorizeCollectionOwnership(req, existingCollection.authorId);

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
        authorId: existingCollection.authorId,
        parentCollection: existingCollection._id,
        tags,
    });
    setItemFields(newItem, fields);

    await newItem.save();

    existingCollection.items.push(newItem._id);
    await existingCollection.save();

    res.status(200).json({ _id: newItem._id });

    if (latestItems.length > latestItemsLimit) latestItems.pop();
    latestItems.unshift(getItemPreview(newItem));
    updatesRequired.latestItems = true;
    if (existingCollection.items.length > largestCollections.at(-1)?.itemNumber) {
        if (largestCollections.length > largestCollectionsLimit) largestCollections.pop();
        largestCollections.push(getCollectionPreview(existingCollection));
        largestCollections.sort((a, b) => b.itemNumber - a.itemNumber);
        updatesRequired.largestCollections = true;
    }
};
