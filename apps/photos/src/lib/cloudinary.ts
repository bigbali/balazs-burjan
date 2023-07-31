import { browser } from '$app/environment';
import { CLOUDINARY_API_KEY, CLOUDINARY_SECRET, CLOUDINARY_CLOUD_NAME } from '$env/static/private';
import { v2 as cloudinary } from 'cloudinary';

if (browser) throw Error();

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_SECRET,
    secure: true
});

export default cloudinary;
