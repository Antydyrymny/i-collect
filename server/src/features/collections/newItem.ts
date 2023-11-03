import { Request, Response } from 'express';
import { CollectionModel, ItemModel, TagModel } from '../../models';
import { getNameVersion } from '../../utils/nameVersioning';
import { getItemPreview } from './utils';
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

    await Promise.all(
        tags.map(async (tagName) => {
            const existingTag = await TagModel.findOne({ name: tagName });
            if (!existingTag) await TagModel.create({ name: tagName });
        })
    );

    const newItem = new ItemModel({
        name: validatedName,
        parentCollection: existingCollection._id,
        tags,
    });
    fields.forEach(({ fieldName: key, fieldValue: val, fieldType: type }) => {
        newItem[type + 'Fields'].set(
            key,
            type === 'date' ? new Date(val as string) : val
        );
    });

    await newItem.save();

    existingCollection.items.push(newItem._id);
    await existingCollection.save();

    res.status(200).json(getItemPreview(newItem));
};
