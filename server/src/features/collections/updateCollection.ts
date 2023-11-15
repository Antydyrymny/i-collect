import { Request, Response } from 'express';
import { CollectionModel, UserModel } from '../../models';
import { getNameVersion } from '../../utils/nameVersioning';
import { UpdateCollectionReq, ResponseError } from '../../types';
import { authorizeCollectionOwnership } from './utils';

export const updateCollection = async (req: Request, res: Response) => {
    const { _id, name: newName }: UpdateCollectionReq = req.body;

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
    await existingCollection.save();

    res.status(200).json(`Collection with id: ${_id} updated successfully`);
};
