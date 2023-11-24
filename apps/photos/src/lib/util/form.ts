import { PUBLIC_CLOUDINARY_API_KEY } from '$env/static/public';
import type { Tag } from '$lib/api';

export const signedForm = (image: File, timestamp: string, signature: string, folder: string, tag: Tag) => {
    const form = new FormData();

    form.append('api_key', PUBLIC_CLOUDINARY_API_KEY);
    form.append('file', image);
    form.append('folder', folder);
    form.append('signature', signature);
    form.append('tags', tag);
    form.append('timestamp', timestamp);

    return form;
};

export const signedFolderForm = (timestamp: string, signature: string, folder: string) => {
    const form = new FormData();

    form.append('api_key', PUBLIC_CLOUDINARY_API_KEY);
    form.append('timestamp', timestamp);
    form.append('signature', signature);
    form.append('folder', folder);

    return form;
};
