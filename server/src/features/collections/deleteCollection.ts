import { Request, Response } from 'express';
import { CollectionModel, UserModel, ItemModel, CommentModel } from '../../models';
import { authorizeResourceOwnership } from '../manageUsers';
import { DeleteCollectionReq, ItemModelType, ResponseError } from '../../types';
import { latestItems, updatesRequired } from '../../data';
import { handleHomeOnDeleteUpdates } from './utils';

export const deleteCollection = async (req: Request, res: Response) => {
    const { _id }: DeleteCollectionReq = req.body;

    const authorId = authorizeResourceOwnership(req);

    const collectionToDelete = await CollectionModel.findById(_id).populate<{
        items: ItemModelType[];
    }>('items');
    if (!collectionToDelete)
        throw new ResponseError(`Collection with id ${_id} not found`, 404);

    const existingAuthor = await UserModel.findById(authorId);
    if (existingAuthor) {
        existingAuthor.collections = existingAuthor.collections.filter(
            (collection) => !collectionToDelete._id.equals(collection)
        );
        await existingAuthor.save();
    }

    const commentsToDelete = [];
    collectionToDelete.items.forEach((item) => commentsToDelete.push(...item.comments));

    await CommentModel.deleteMany({ _id: { $in: commentsToDelete } });
    await ItemModel.deleteMany({
        _id: { $in: collectionToDelete.items.map((item) => item._id) },
    });

    latestItems.length = 0;
    updatesRequired.latestItems = true;
    handleHomeOnDeleteUpdates('largestCollections', collectionToDelete._id);

    await collectionToDelete.deleteOne();

    res.status(200).json(`Collection with id: ${_id} successfully deleted`);
};
