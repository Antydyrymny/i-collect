import { NextFunction, Request, Response } from 'express';
import { CollectionModel, UserModel } from '../../models';
import { authorizeCollectionOwnership, getCollectionResponse } from './utils';
import { uploadImage, getNameVersion, deleteImageFromCloud } from '../../utils';
import {
    UpdateCollectionReq,
    ResponseError,
    CollectionResponse,
    ItemModelType,
} from '../../types';

export const parseCollectionUpdate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    req.body.format = JSON.parse(req.body.format);
    next();
};

export const updateCollection = async (
    req: Request,
    res: Response<CollectionResponse>
) => {
    const {
        _id,
        name: newName,
        deleteImage,
        format = [],
    }: UpdateCollectionReq = req.body;
    const image = req.file;

    const existingCollection = await CollectionModel.findById(_id);
    if (!existingCollection)
        throw new ResponseError(`Collection with id ${_id} not found`, 404);

    authorizeCollectionOwnership(req, existingCollection.authorId);

    if (format.length) {
        await existingCollection.populate<{
            items: ItemModelType[];
        }>('items');

        format.forEach((field) => {
            if (field.action === 'add') {
                existingCollection.format.push({
                    fieldName: field.fieldName,
                    fieldType: field.fieldType,
                });
            } else if (field.action === 'rename') {
                existingCollection.format = existingCollection.format.map(
                    (existingField) =>
                        existingField.fieldName === field.fieldName &&
                        existingField.fieldType === field.fieldType
                            ? { ...existingField, fieldName: field.newName }
                            : existingField
                );
            } else {
                existingCollection.format = existingCollection.format.filter(
                    (existingField) => existingField.fieldName !== field.fieldName
                );
            }
            existingCollection.items.forEach((item) => {
                const editingField = item[field.fieldType + 'Fields'];
                console.log(field, editingField);
                if (field.action === 'add') {
                    editingField.set(
                        field.fieldName,
                        field.fieldType === 'boolean'
                            ? true
                            : field.fieldType === 'number'
                            ? 0
                            : field.fieldType === 'string' || field.fieldType === 'text'
                            ? '-'
                            : new Date()
                    );
                } else if (field.action === 'rename') {
                    const tmp = editingField.get(field.fieldName);
                    editingField.delete(field.fieldName);
                    editingField.set(field.newName, tmp);
                } else {
                    editingField.delete(field.fieldName);
                }
            });
        });

        await Promise.all(
            existingCollection.items.map((item) =>
                (item as unknown as ItemModelType).save()
            )
        );
    }

    const existingAuthor = await UserModel.findById(
        existingCollection.authorId
    ).populate<{
        collections: { _id: string; name: string }[];
    }>('collections', 'name');
    if (!existingAuthor)
        throw new ResponseError(
            `Author with id ${existingCollection.authorId} not found`,
            404
        );

    let validatedName = newName ?? existingCollection.name;
    if (newName && existingAuthor.populated('collections')) {
        validatedName = getNameVersion(
            validatedName,
            existingAuthor.collections.reduce(
                (acc: string[], collection) =>
                    collection._id === _id ? acc : acc.concat(collection.name),
                []
            )
        );
    }

    existingCollection.name = validatedName;
    ['description', 'theme'].forEach(
        (paramName) =>
            (existingCollection[paramName] =
                req.body[paramName] ?? existingCollection[paramName])
    );
    if (image) {
        if (existingCollection.imageId) {
            await deleteImageFromCloud(existingCollection.imageId);
        }
        const { url, id } = await uploadImage(image);

        existingCollection.image = url;
        existingCollection.imageId = id;
    } else if (deleteImage && existingCollection.image && existingCollection.imageId) {
        await deleteImageFromCloud(existingCollection.imageId);

        existingCollection.image = '';
        existingCollection.imageId = '';
    }

    await existingCollection.save();

    res.status(200).json(getCollectionResponse(existingCollection));
};
