import { Request, Response } from 'express';
import { io } from '../../app';
import { CommentModel, ItemModel } from '../../models';
import {
    NewCommentReq,
    ResponseError,
    Routes,
    ServerToItemViewer,
    UserModelType,
} from '../../types';

export const newComment = async (req: Request, res: Response) => {
    const { toItem, content }: NewCommentReq = req.body;
    const commentAuthor = req.user as UserModelType;

    const existingItem = await ItemModel.findById(toItem);
    if (!existingItem) throw new ResponseError(`Item with id: ${toItem} not found`, 404);

    const newComment = await CommentModel.create({
        authorId: commentAuthor._id,
        authorName: commentAuthor.name,
        toItem: existingItem._id,
        content,
    });

    existingItem.comments.push(newComment._id);

    await existingItem.save();

    io.of(Routes.Api + Routes.ItemSocket)
        .to(toItem)
        .emit(ServerToItemViewer.NewComment, {
            _id: newComment._id,
            authorName: newComment.authorName,
            content,
        });

    res.status(200).json('Comment created successfully');
};
