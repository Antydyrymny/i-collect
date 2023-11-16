import { Request, Response } from 'express';
import { CollectionModel, ItemModel } from '../../models';
import { getNameVersion } from '../../utils/nameVersioning';
import {
    authorizeCollectionOwnership,
    getItemResponse,
    setItemFields,
    updateTags,
} from './utils';
import { UpdateItemReq, ItemResponse, ResponseError, AuthUser } from '../../types';

export const updateItem = async (req: Request, res: Response<ItemResponse>) => {
    const { _id, name: newName, tags = [], fields }: UpdateItemReq = req.body;

    const existingItem = await ItemModel.findById(_id);
    if (!existingItem) throw new ResponseError(`Item with id ${_id} not found`, 404);

    const parentCollection = newName
        ? await CollectionModel.findById(existingItem.parentCollection).populate<{
              items: { name: string }[];
          }>('items', 'name')
        : await CollectionModel.findById(existingItem.parentCollection);

    if (!parentCollection)
        throw new ResponseError(`No parent collection for item ${_id} was found`, 404);

    authorizeCollectionOwnership(req, parentCollection.authorId);

    const itemConformsToCollectionFormat =
        !fields ||
        fields.every(({ fieldName: key, fieldType: type }) => {
            existingItem[type + 'Fields'].has(key);
        });
    if (!itemConformsToCollectionFormat)
        throw new ResponseError(
            `Request's field formats are incompatible with the collection schema`,
            422
        );

    let validatedName = newName ?? existingItem.name;
    if (newName && parentCollection.populated('items')) {
        validatedName = getNameVersion(
            validatedName,
            (parentCollection.items as { name: string }[]).map((item) => item.name)
        );
    }

    await updateTags(tags);

    existingItem.name = validatedName;
    existingItem.tags = tags;
    if (fields) setItemFields(existingItem, fields);

    await existingItem.save();

    res.status(200).json(
        getItemResponse(
            existingItem,
            parentCollection._id,
            parentCollection.name,
            (req.user as AuthUser)._id
        )
    );
};
