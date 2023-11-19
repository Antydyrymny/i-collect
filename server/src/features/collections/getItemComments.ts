import { Request, Response } from 'express';
import { CommentModel, ItemModel } from '../../models';
import { CommentRes, GetItemCommentsQuery, ResponseError } from '../../types';
import { getCommentResponse } from './utils';

export const getItemComments = async (req: Request, res: Response<CommentRes[]>) => {
    const queryParams = req.query as GetItemCommentsQuery;

    const itemId = queryParams.itemId;
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;

    const existingItem = await ItemModel.findOne({ _id: itemId });
    if (!existingItem) throw new ResponseError(`Item with id: ${itemId} not found`, 404);

    const results = await CommentModel.find({
        _id: { $in: existingItem.comments },
    })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    res.status(200).json(results.map((comment) => getCommentResponse(comment)));
};
