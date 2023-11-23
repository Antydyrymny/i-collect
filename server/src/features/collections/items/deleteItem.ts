import { Request, Response } from 'express';
import { CollectionModel, CommentModel, ItemModel } from '../../../models';
import { authorizeCollectionOwnership, handleHomeOnDeleteUpdates } from '../utils';
import { DeleteItemReq, ResponseError } from '../../../types';
import { largestCollections, latestItems } from '../../../data';

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

    console.log(latestItems);
    handleHomeOnDeleteUpdates('latestItems', itemToDelete._id);
    console.log(latestItems);
    console.log(largestCollections);
    if (
        largestCollections.findIndex((collection) =>
            collection._id.equals(parentCollection._id)
        ) !== -1 &&
        parentCollection.items.length < largestCollections.at(-2)?.items?.length
    ) {
        handleHomeOnDeleteUpdates('largestCollections', parentCollection._id);
    }
    console.log(largestCollections);

    await itemToDelete.deleteOne();

    res.status(200).json(`Item with id: ${_id} successfully deleted`);
};
