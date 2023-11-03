import { Request, Response } from 'express';
import { CollectionModel, UserModel } from '../../models';
import { getNameVersion } from '../../utils/nameVersioning';
import { UpdateCollectionReq, ResponseError, UserQuery } from '../../types';

export const updateCollection = async (req: Request, res: Response) => {
    const { id, name: newName }: UpdateCollectionReq = req.body;
    const queryParams = req.query as UserQuery;
    const authorId = queryParams.id;

    const existingCollection = await CollectionModel.findById(id);
    if (!existingCollection)
        throw new ResponseError(`Collection with id ${id} not found`, 404);

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
                    collection._id === id ? acc : acc.concat(collection.name),
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

    res.status(200).json(`Collection with id: ${id} updated successfully`);
};
