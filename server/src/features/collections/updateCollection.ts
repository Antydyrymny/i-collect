import { Request, Response } from 'express';
import { CollectionModel, UserModel } from '../../models';
import { authorizeCollectionOwnership, getCollectionResponse } from './utils';
import { uploadImage, getNameVersion, deleteImage } from '../../utils';
import { UpdateCollectionReq, ResponseError, CollectionResponse } from '../../types';

export const updateCollection = async (
    req: Request,
    res: Response<CollectionResponse>
) => {
    const { _id, name: newName }: UpdateCollectionReq = req.body;
    const image = req.file;

    const existingCollection = await CollectionModel.findById(_id);
    if (!existingCollection)
        throw new ResponseError(`Collection with id ${_id} not found`, 404);

    authorizeCollectionOwnership(req, existingCollection.authorId);

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
    ['description', 'theme', 'image'].forEach(
        (paramName) =>
            (existingCollection[paramName] =
                req.body[paramName] ?? existingCollection[paramName])
    );
    if (image) {
        const { url, id } = await uploadImage(image);
        if (existingCollection.imageId) await deleteImage(existingCollection.imageId);

        existingCollection.image = url;
        existingCollection.imageId = id;
    }

    await existingCollection.save();

    res.status(200).json(getCollectionResponse(existingCollection));
};
