import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import cloudinary from '$lib/cloudinary';
import prisma from '$lib/prisma';
import { CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME, CLOUDINARY_SECRET } from '$env/static/private';

const URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const form = (image: File, timestamp: string, folder: string, thumbnail: boolean = false) => {
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

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.getSession();

    if (session?.user.role !== 'admin') {
        throw redirect(302, '/');
    }

    const albums = await prisma.album.findMany({
        take: 25,
        include: {
            thumbnail: true
        }
    });

    return {
        albums
    };
};

export const actions = {
    create: async ({ request }) => {
        const data = await request.formData();
        const title = data.get('title') as string;
        const slug = data.get('slug') as string;
        const description = data.get('description') as string;
        const hidden = data.get('hidden') as 'hidden' | '';
        const thumbnail = data.get('thumbnail') as File;
        const images = data.getAll('images') as File[];

        try {
            type Response = {
                success: boolean,
                path: string,
            };

            const folder = await cloudinary.api.create_folder(`photos/${title}`) as Response;

            if (folder.success) {
                const timestamp = Math.round((new Date).getTime() / 1000).toString();

                const imagePaths: string[] = [];
                let thumbnail_path;

                for (const image of images) {
                    if (!image) return;

                    const response = await fetch(URL, {
                        method: 'POST',
                        body: form(image, timestamp, folder.path)
                    });

                    const url = await response.json();
                    imagePaths.push(url.secure_url as string);
                }

                const download_url = (await cloudinary.uploader.create_zip({
                    prefixes: folder.path,
                    flatten_folders: true
                })).secure_url as string;

                if (thumbnail) {
                    const folderPath = `${folder.path}/thumbnail`;

                    const response = await fetch(URL, {
                        method: 'POST',
                        body: form(thumbnail, timestamp, folderPath, true)
                    });

                    thumbnail_path = (await response.json()).secure_url as string;
                }

                const newAlbum = await prisma.album.create({
                    data: {
                        title,
                        description,
                        path: folder.path,
                        archive: download_url,
                        slug,
                        images: {
                            create: imagePaths.map(image => ({ path: image }))
                        },
                        thumbnail: thumbnail_path
                            ? {
                                create: {
                                    path: thumbnail_path
                                }
                            }
                            : {}
                    }
                });

                return { success: true, album: newAlbum };
            }
        } catch (e) {
            return { success: false, error: true };
        }

        return { success: false };
    }
};