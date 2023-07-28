import { CLOUDINARY_API_KEY, CLOUDINARY_SECRET, CLOUDINARY_CLOUD_NAME } from '$env/static/private';
import type { PageServerLoad } from './$types';
import { v2 as cloudinary } from 'cloudinary';

export const load: PageServerLoad = async () => {
    cloudinary.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_SECRET,
        secure: true
    });

    const albums = await cloudinary.api.sub_folders('samples');

    return {
        albums
    };
};