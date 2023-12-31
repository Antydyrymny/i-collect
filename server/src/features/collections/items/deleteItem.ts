import { Request, Response } from 'express';
import { CollectionModel, CommentModel, ItemModel } from '../../../models';
import { authorizeCollectionOwnership, handleHomeOnDeleteUpdates } from '../utils';
import { DeleteItemReq, ResponseError } from '../../../types';
import { largestCollections } from '../../../data';

export const deleteItem = async (req: Request, res: Response) => {
    const { _id }: DeleteItemReq = req.body;

    const itemToDelete = await ItemModel.findById(_id);
    if (!itemToDelete) throw new ResponseError(`Item with id: ${_id} not found`, 404);

    const parentCollection = await CollectionModel.findById(
        itemToDelete.parentCollection
    );
    if (!parentCollection)
        throw new ResponseError(`No parent collection for item ${_id} was found`, 404);

    authorizeCollectionOwnership(req, parentCollection.authorId);

    parentCollection.items = parentCollection.items.filter(
        (item) => !itemToDelete._id.equals(item)
    );
    await parentCollection.save();

    await CommentModel.deleteMany({ _id: { $in: itemToDelete.comments } });

    handleHomeOnDeleteUpdates('latestItems', itemToDelete._id);
    const indInLargestCollections = largestCollections.findIndex((collection) =>
        collection._id.equals(parentCollection._id)
    );
    if (indInLargestCollections !== -1) {
        if (indInLargestCollections === largestCollections.length - 1)
            handleHomeOnDeleteUpdates('largestCollections', parentCollection._id);
        else largestCollections[indInLargestCollections].itemNumber--;
    }

    await itemToDelete.deleteOne();

    res.status(200).json(`Item with id: ${_id} successfully deleted`);
};
