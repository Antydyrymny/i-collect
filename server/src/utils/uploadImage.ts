import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { bufferToDataURI } from './bufferToDataURI';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (image: Express.Multer.File) => {
    const fileFormat = image.mimetype.split('/')[1];
    const { base64 } = bufferToDataURI(fileFormat, image.buffer);

    const { uploader } = cloudinary;
    //prettier-ignore
    const imageDetails = await uploader.upload(
        `data:image/${fileFormat};base64,${base64}`,
        {
            transformation: {
                width: 320,
                height: 180,
                crop: 'fit',
            },
        }
    );

    return { url: imageDetails.secure_url, id: imageDetails.public_id };
};
