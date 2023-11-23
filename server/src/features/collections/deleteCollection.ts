import { Request, Response } from 'express';
import { CollectionModel, UserModel, ItemModel, CommentModel } from '../../models';
import { DeleteCollectionReq, ItemModelType, ResponseError } from '../../types';
import { latestItems, updatesRequired } from '../../data';
import { authorizeCollectionOwnership, handleHomeOnDeleteUpdates } from './utils';
import { deleteImageFromCloud } from '../../utils';

export const deleteCollection = async (req: Request, res: Response) => {
    const { _id }: DeleteCollectionReq = req.body;

    const collectionToDelete = await CollectionModel.findById(_id).populate<{
        items: ItemModelType[];
    }>('items');
    if (!collectionToDelete)
        throw new ResponseError(`Collection with id ${_id} not found`, 404);

    authorizeCollectionOwnership(req, collectionToDelete.authorId);

    const existingAuthor = await UserModel.findById(collectionToDelete.authorId);
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

    let newLatestItemsInd = 0;
    latestItems.forEach((item, ind) => {
        if (
            collectionToDelete.items.every((deletedItem) => !item._id.equals(deletedItem))
        ) {
            if (ind! === newLatestItemsInd) latestItems[newLatestItemsInd] = item;
            newLatestItemsInd++;
        } else updatesRequired.latestItems = true;
    });
    latestItems.length = newLatestItemsInd;

    handleHomeOnDeleteUpdates('largestCollections', collectionToDelete._id);

    if (collectionToDelete.imageId)
        await deleteImageFromCloud(collectionToDelete.imageId);

    await collectionToDelete.deleteOne();

    res.status(200).json(`Collection with id: ${_id} successfully deleted`);
};
