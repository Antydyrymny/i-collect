import { Request, Response } from 'express';
import { CollectionModel, UserModel } from '../../models';
import { getNameVersion } from '../../utils/nameVersioning';
import { authorizeResourceOwnership } from '../manageUsers';
import { UpdateCollectionReq, ResponseError } from '../../types';

export const updateCollection = async (req: Request, res: Response) => {
    const { _id, name: newName }: UpdateCollectionReq = req.body;

    const authorId = authorizeResourceOwnership(req);

    const existingCollection = await CollectionModel.findById(_id);
    if (!existingCollection)
        throw new ResponseError(`Collection with id ${_id} not found`, 404);

    const existingAuthor = await UserModel.findById(authorId).populate<{
        collections: { _id: string; name: string }[];
    }>('collections', 'name');
    if (!existingAuthor)
        throw new ResponseError(`Author with id ${authorId} not found`, 404);

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
