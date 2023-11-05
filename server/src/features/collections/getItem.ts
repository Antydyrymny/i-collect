import { Request, Response } from 'express';
import { Schema } from 'mongoose';
import { ItemModel } from '../../models';
import { getItemResponse } from './utils';
import { GetItemQuery, ItemResponse, ResponseError } from '../../types';

export const getItem = async (req: Request, res: Response<ItemResponse>) => {
    const queryParams = req.query as GetItemQuery;
    const { _id } = queryParams;

    const existingItem = await ItemModel.findById(_id).populate<{
        parentCollection: { name: string; _id: Schema.Types.ObjectId };
    }>('parentCollection', 'name');
    if (!existingItem) throw new ResponseError(`Item with id: ${_id} not found`, 404);

    res.status(200).json(
        getItemResponse(
            existingItem,
            existingItem.parentCollection._id,
            existingItem.parentCollection.name
        )
    );
};
