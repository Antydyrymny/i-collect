import { Request, Response } from 'express';
import { ItemModel } from '../../models';
import { io } from '../../app';
import {
    ResponseError,
    Routes,
    ServerToItemViewer,
    ToggleLikeItemReq,
    UserModelType,
} from '../../types';

export const toggleLikeItem = async (req: Request, res: Response) => {
    const { _id, action }: ToggleLikeItemReq = req.body;
    const requestingUser = req.user as UserModelType;

    const existingItem = await ItemModel.findById(_id);
    if (!existingItem) throw new ResponseError(`Item with id: ${_id} not found`, 404);

    const alreadyLiked = existingItem.likesFrom.some((userThatLiked) =>
        requestingUser._id.equals(userThatLiked)
    );

    if ((action === 'like' && alreadyLiked) || (action === 'dislike' && !alreadyLiked))
        throw new ResponseError(
            action === 'like'
                ? 'User already liked the item'
                : 'User never liked the item',
            400
        );

    existingItem.likesFrom =
        action === 'like'
            ? existingItem.likesFrom.concat(requestingUser._id)
            : existingItem.likesFrom.filter(
                  (userThatLiked) => !requestingUser._id.equals(userThatLiked)
              );

    await existingItem.save();

    io.of(Routes.Api + Routes.ItemSocket)
        .to(_id)
        .emit(ServerToItemViewer.LikesUpdated, existingItem.likesFrom.length);

    res.status(200).json(action === 'like' ? 'Like added' : 'Like removed');
};
