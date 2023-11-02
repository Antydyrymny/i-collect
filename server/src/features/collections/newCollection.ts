// import { Request, Response } from 'express';
// import { CollectionModel, UserModel } from '../../models';
// import { NewCollectionReq } from '../../types';
// import mongoose from 'mongoose';

// export const newCollection = async (req: Request, res: Response) => {
//     const { name, description, theme, image, authorId, format }: NewCollectionReq =
//         req.body;

//     const newCollection = new CollectionModel({
//         name,
//         description,
//         theme,
//         image,
//         authorId,
//         format,
//     });
//     newCollection.itemModelName = name + 'Item' + newCollection._id.toString();
//     await newCollection.save();

//     await UserModel.updateOne(
//         { _id: authorId },
//         { $addToSet: { collectionIds: newCollection._id } }
//     );

//     // const NewItem = new mongoose.Schema({
//     //     name: {
//     //         type: String,
//     //         maxlength: 255,
//     //         required: true,
//     //     },
//     //     // tags:
//     // });
// };
