import { Request, Response } from 'express';
import { CollectionModel, UserModel } from '../../models';
import { getNameVersion } from '../../utils/nameVersioning';
import {
    NewCollectionReq,
    NewCollectionRes,
    ResponseError,
    UserQuery,
} from '../../types';

export const newCollection = async (req: Request, res: Response<NewCollectionRes>) => {
    const { name, description, theme, image, format }: NewCollectionReq = req.body;
    const queryParams = req.query as UserQuery;
    const authorId = queryParams.id;

    const existingAuthor = await UserModel.findById(authorId).populate<{
        collections: { name: string }[];
    }>('collections', 'name');

    if (!existingAuthor)
        throw new ResponseError(`Author with id ${authorId} not found`, 404);

    let validatedName = name;
    if (existingAuthor.populated('collections')) {
        validatedName = getNameVersion(
            validatedName,
            existingAuthor.collections.map((collection) => collection.name)
        );
    }

    const newCollection = await CollectionModel.create({
        name: validatedName,
        description,
        theme,
        image,
        authorName: existingAuthor.name,
        format,
    });

    existingAuthor.collections.push(newCollection._id);
    await existingAuthor.save();

    res.status(200).json({ id: newCollection._id });
};
