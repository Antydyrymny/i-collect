import { Request, Response } from 'express';
import { CollectionModel } from '../../models';
import { CollectionResponse, GetCollectionQuery, ResponseError } from '../../types';
import { getCollectionResponse } from './utils';

export const getCollection = async (req: Request, res: Response<CollectionResponse>) => {
    const queryParams = req.query as GetCollectionQuery;
    const { _id } = queryParams;

    const existingCollection = await CollectionModel.findById(_id);
    if (!existingCollection)
        throw new ResponseError(`Collection with id: ${_id} not found`, 404);

    res.status(200).json(getCollectionResponse(existingCollection));
};
