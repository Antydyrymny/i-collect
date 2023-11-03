import { Request, Response } from 'express';
import { CollectionModel, UserModel, ItemModel, CommentModel } from '../../models';
import { DeleteCOllectionReq, ItemModelType, ResponseError } from '../../types';

export const deleteCollection = async (req: Request, res: Response) => {
    const { id, authorId }: DeleteCOllectionReq = req.body;

    const collectionToDelete = await CollectionModel.findById(id).populate<{
        items: ItemModelType[];
    }>('items');
    if (!collectionToDelete)
        throw new ResponseError(`Collection with id ${id} not found`, 404);

    const existingAuthor = await UserModel.findById(authorId);
    if (existingAuthor) {
        existingAuthor.collections = existingAuthor.collections.filter(
            (collection) => collection !== collectionToDelete._id
        );
        await existingAuthor.save();
    }

    const commentsToDelete = [];
    collectionToDelete.items.forEach((item) => commentsToDelete.push(...item.comments));

    await CommentModel.deleteMany({ _id: { $in: commentsToDelete } });
    await ItemModel.deleteMany({
        _id: { $in: collectionToDelete.items.map((item) => item._id) },
    });
    await collectionToDelete.deleteOne();

    res.status(200).json(`Collection with id: ${id} successfully deleted`);
};
