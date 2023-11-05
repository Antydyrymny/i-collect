import { Request, Response } from 'express';
import { ItemModel } from '../../models';
import {
    CommentModelType,
    CommentRes,
    GetItemCommentsQuery,
    ResponseError,
} from '../../types';

export const getItemComments = async (req: Request, res: Response<CommentRes[]>) => {
    const queryParams = req.query as GetItemCommentsQuery;

    const itemId = queryParams.itemId;
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;

    const existingItem = await ItemModel.findOne(
        { _id: itemId },
        { comments: { $slice: [(page - 1) * limit, limit] } }
    ).populate<{
        comments: CommentModelType[];
    }>('comments');

    if (!existingItem) throw new ResponseError(`Item with id: ${itemId} not found`, 404);

    res.status(200).json(
        existingItem.comments.map((comment) => ({
            _id: comment._id,
            authorName: comment.authorName,
            content: comment.content,
        }))
    );
};
