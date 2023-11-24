import { NextFunction, Request, Response } from 'express';
import { CollectionModel, UserModel } from '../../models';
import { getNameVersion } from '../../utils/nameVersioning';
import { authorizeResourceOwnership } from '../manageUsers';
import { NewCollectionReq, NewCollectionRes, ResponseError } from '../../types';
import { uploadImage } from '../../utils';

export const parseNewCollection = (req: Request, res: Response, next: NextFunction) => {
    if (req.body.format) req.body.format = JSON.parse(req.body.format);
    next();
};

export const newCollection = async (req: Request, res: Response<NewCollectionRes>) => {
    const { name, description, theme, format }: NewCollectionReq = req.body;
    const image = req.file;

    const authorId = authorizeResourceOwnership(req);

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

    const newCollection = new CollectionModel({
        name: validatedName,
        description,
        theme,
        authorId: existingAuthor._id,
        authorName: existingAuthor.name,
        format,
    });

    if (image) {
        const { url, id } = await uploadImage(image);
        newCollection.image = url;
        newCollection.imageId = id;
    }

    await newCollection.save();

    existingAuthor.collections.push(newCollection._id);
    await existingAuthor.save();

    res.status(200).json({ _id: newCollection._id });
};
