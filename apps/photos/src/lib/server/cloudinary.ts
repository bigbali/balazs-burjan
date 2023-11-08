import { browser } from '$app/environment';
import { CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME, CLOUDINARY_SECRET } from '$env/static/private';
import { v2 as cloudinary } from 'cloudinary';

export const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

if (browser) throw Error('Tried to use Cloudinary API from the client.');

export const signedImageForm = (image: File, timestamp: string, folder: string, thumbnail = false) => {
    const tag = thumbnail ? 'thumbnail' : 'image';

    const signature = cloudinary.utils.api_sign_request({
        timestamp: timestamp,
        folder: folder,
        tags: tag
    }, CLOUDINARY_SECRET);

    const form = new FormData();

    form.append('file', image);
    form.append('api_key', CLOUDINARY_API_KEY);
    form.append('timestamp', timestamp);
    form.append('signature', signature);
    form.append('folder', folder);
    form.append('tags', tag);

    return form;
};

export const signedThumbnailForm = (image: File, timestamp: string, folder: string) => {
    return signedImageForm(image, timestamp, folder, true);
};

export const timestamp = () => Math.round((new Date).getTime() / 1000).toString();

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_SECRET,
    secure: true
});

export default cloudinary;


