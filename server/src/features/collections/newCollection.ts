import { Request, Response } from 'express';
import { CollectionModel, UserModel } from '../../models';
import { getNameVersion } from '../../utils/nameVersioning';
import { NewCollectionReq, ResponseError } from '../../types';

export const newCollection = async (req: Request, res: Response) => {
    const { name, description, theme, image, author, format }: NewCollectionReq =
        req.body;

    const existingAuthor = await UserModel.findById(author).populate<{
        collections: { name: string }[];
    }>('collections', 'name');

    if (!existingAuthor)
        throw new ResponseError(`Author with id ${author} not found`, 404);

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
        author,
        format,
    });

    await UserModel.updateOne(
        { _id: author },
        { $addToSet: { collections: newCollection._id } }
    );

    res.status(200).json(`Collection ${validatedName} created successfully`);
};
