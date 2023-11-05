import { Request, Response } from 'express';
import { CollectionModel } from '../../models';
import { getItemPreview } from './utils';
import {
    GetCollectionItemsQuery,
    ItemModelType,
    ItemPreview,
    ResponseError,
} from '../../types';

export const getCollectionItems = async (req: Request, res: Response<ItemPreview[]>) => {
    const queryParams = req.query as GetCollectionItemsQuery;

    const collectionId = queryParams.collectionId;
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;

    const existingCollection = await CollectionModel.findOne(
        { _id: collectionId },
        { items: { $slice: [(page - 1) * limit, limit] } }
    ).populate<{
        items: ItemModelType[];
    }>('items');

    if (!existingCollection)
        throw new ResponseError(`Collection with id: ${collectionId} not found`, 404);

    res.status(200).json(existingCollection.items.map((item) => getItemPreview(item)));
};
