import { Request, Response } from 'express';
import { io } from '../../../app';
import { CommentModel } from '../../../models';
import {
    EditCommentReq,
    ResponseError,
    Routes,
    ServerToItemViewer,
} from '../../../types';
import { authorizeCommentEdit } from '../utils';

export const editComment = async (req: Request, res: Response) => {
    const { _id, content }: EditCommentReq = req.body;

    const existingComment = await CommentModel.findById(_id);
    if (!existingComment)
        throw new ResponseError(`Comment with id: ${_id} not found`, 404);

    authorizeCommentEdit(req, existingComment.authorId);

    existingComment.content = content;
    await existingComment.save();

    io.of(Routes.Api + Routes.ItemSocket)
        .to(existingComment.toItem.toString())
        .emit(ServerToItemViewer.CommentUpdated, {
            _id: existingComment._id,
            content,
        });

    res.status(200).json('Comment edited successfully');
};
