import { Request, Response } from 'express';
import { io } from '../../app';
import { CommentModel, ItemModel } from '../../models';
import { DeleteCommentReq, ResponseError, Routes, ServerToItemViewer } from '../../types';
import { authorizeCommentEdit } from './utils';

export const deleteComment = async (req: Request, res: Response) => {
    const { _id }: DeleteCommentReq = req.body;

    const existingComment = await CommentModel.findById(_id);
    if (!existingComment)
        throw new ResponseError(`Comment with id: ${_id} not found`, 404);

    authorizeCommentEdit(req, existingComment.authorId);

    const deletion = await ItemModel.updateOne(
        { _id: existingComment.toItem },
        { $pull: { comments: _id } }
    );

    if (deletion.modifiedCount !== 1)
        throw new ResponseError(
            'Item not found or comment not present in the array',
            404
        );

    await existingComment.deleteOne();

    io.of(Routes.Api + Routes.ItemSocket)
        .to(existingComment.toItem.toString())
        .emit(ServerToItemViewer.CommentDeleted, _id);

    res.status(200).json('Comment deleted successfully');
};
