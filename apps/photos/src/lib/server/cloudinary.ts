import { browser } from '$app/environment';
import { CLOUDINARY_SECRET } from '$env/static/private';
import { PUBLIC_CLOUDINARY_API_KEY, PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';
import { v2 as cloudinary } from 'cloudinary';

export const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

if (browser) throw Error('Tried to use Cloudinary API from the client.');

cloudinary.config({
    cloud_name: PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: PUBLIC_CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_SECRET,
    secure: true
});

export default cloudinary;

export const timestamp = () => Math.round((new Date).getTime() / 1000).toString();

export const sign = (properties: Record<string, string>, _timestamp: string = timestamp()) => {
    return {
        timestamp: _timestamp,
        signature: cloudinary.utils.api_sign_request({ timestamp: _timestamp, ...properties }, CLOUDINARY_SECRET)
    };
};
