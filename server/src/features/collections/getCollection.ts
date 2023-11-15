import { Request, Response } from 'express';
import { CollectionModel } from '../../models';
import { CollectionResponse, GetCollectionQuery, ResponseError } from '../../types';

export const getCollection = async (req: Request, res: Response<CollectionResponse>) => {
    const queryParams = req.query as GetCollectionQuery;
    const { _id } = queryParams;

    const existingCollection = await CollectionModel.findById(_id);
    if (!existingCollection)
        throw new ResponseError(`Collection with id: ${_id} not found`, 404);

    res.status(200).json({
        _id: existingCollection._id,
        name: existingCollection.name,
        description: existingCollection.description,
        theme: existingCollection.theme,
        image: existingCollection.image,
        authorId: existingCollection.authorId,
        authorName: existingCollection.authorName,
        format: existingCollection.format,
        itemNumber: existingCollection.items.length,
    });
};
