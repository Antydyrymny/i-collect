import { Request, Response } from 'express';
import { CollectionModel } from '../../models';
import { itemSearch } from './utils';
import { FindCollectionItemQuery, ItemPreview, ResponseError } from '../../types';

export const findCollectionItems = async (req: Request, res: Response<ItemPreview[]>) => {
    const queryParams = req.query as FindCollectionItemQuery;
    const { collectionId, query } = queryParams;

    const existingCollection = await CollectionModel.findById(collectionId);
    if (!existingCollection)
        throw new ResponseError(`Collection with id: ${collectionId} not found`, 404);

    const results = await itemSearch({
        query,
        restrictToCollectionItems: existingCollection.items,
        searchInCollections: false,
    });

    res.status(200).json(results);
};
