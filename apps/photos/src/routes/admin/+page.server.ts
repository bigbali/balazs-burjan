import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import cloudinary from '$lib/cloudinary';
import prisma from '$lib/prisma';
import { CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME, CLOUDINARY_SECRET } from '$env/static/private';

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
        const title = data.get('title') as string || 'Névtelen';
        const slug = data.get('slug') as string;
        const description = data.get('description') as string || '';
        const thumbnail = data.get('thumbnail') as File;
        const images = data.getAll('images') as File[];

        type Response = {
            success: boolean,
            path: string,
        };

        const folder = await cloudinary.api.create_folder(`photos/${title}`) as Response;

        if (folder.success) {
            const timestamp = Math.round((new Date).getTime() / 1000).toString();
            const imageSignature = cloudinary.utils.api_sign_request({
                timestamp: timestamp,
                eager: 'c_pad,h_300,w_400|c_crop,h_200,w_260',
                folder: folder.path
            }, CLOUDINARY_SECRET);

            const imagePaths: string[] = [];
            let thumbnail_path;

            for (const image of images) {
                if (!image) return;

                const form = new FormData();
                form.append('file', image);
                form.append('api_key', CLOUDINARY_API_KEY);
                form.append('timestamp', timestamp);
                form.append('signature', imageSignature);
                form.append('eager', 'c_pad,h_300,w_400|c_crop,h_200,w_260');
                form.append('folder', folder.path);

                const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                    method: 'POST',
                    body: form
                });

                const url = await response.json();
                imagePaths.push(url.secure_url as string);
            }

            if (thumbnail) {
                const folderPath = `${folder.path}/thumbnail`;
                const thumbnailSignature = cloudinary.utils.api_sign_request({
                    timestamp: timestamp,
                    eager: 'c_pad,h_300,w_400|c_crop,h_200,w_260',
                    folder: folderPath
                }, CLOUDINARY_SECRET);

                const form = new FormData();
                form.append('file', thumbnail);
                form.append('api_key', CLOUDINARY_API_KEY);
                form.append('timestamp', timestamp);
                form.append('signature', thumbnailSignature);
                form.append('eager', 'c_pad,h_300,w_400|c_crop,h_200,w_260');
                form.append('folder', folderPath);

                const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                    method: 'POST',
                    body: form
                });

                thumbnail_path = (await response.json()).secure_url as string;
            }

            const newAlbum = await prisma.album.create({
                data: {
                    title,
                    description,
                    path: folder.path,
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

        return { success: false };
    }
};