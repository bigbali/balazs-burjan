import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ActionResponse, CloudinaryFolderResponse, ImageData } from '$lib/type';
import prisma from '$lib/server/prisma';
import cloudinary, { timestamp as getTimestamp, UPLOAD_URL } from '$lib/server/cloudinary';

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.getSession();

    if (session?.user.role !== 'admin') {
        throw redirect(302, '/');
    }

    const albums = await prisma.album.findMany({
        take: 25,
        include: {
            thumbnail: true,
            images: true
        }
    });

    return {
        albums
    };
};

export const actions = {
    create: async ({ request }): Promise<ActionResponse> => {
        // const data = await request.formData();
        // const title = (data.get('title') as string).replace(/ /g, '_');
        // const slug = data.get('slug') as string;
        // const description = data.get('description') as string;
        // const hidden = !!data.get('hidden');
        // const thumbnail = data.get('thumbnail') as File;
        // const images = data.getAll('images') as File[];

        // try {
        // const folder = await cloudinary.api.create_folder(`photos/${title}`) as CloudinaryFolderResponse;

        //     if (folder.success) {
        // const timestamp = getTimestamp();

        // const imagesData: ImageData[] = [];
        // let cloudinary_res;

        // for (const image of images) {
        //     if (image.size === 0) continue;

        //     const response = await fetch(UPLOAD_URL, {
        //         method: 'POST',
        //         body: signedImageForm(image, timestamp, folder.path)
        //     });

        //     const res = await response.json();

        //     imagesData.push({
        //         path: res.secure_url as string,
        //         cloudinaryAssetId: res.asset_id as string,
        //         cloudinaryPublicId: res.public_id as string,
        //         width: res.width as number,
        //         height: res.height as number,
        //         format: res.format as string,
        //         size: res.bytes as number
        //     });
        // }

        // const download_url = (await cloudinary.uploader.create_zip({
        //     prefixes: folder.path,
        //     flatten_folders: true
        // })).secure_url as string;

        //         if (thumbnail.size > 0) {
        //             const folderPath = `${folder.path}/thumbnail`;

        //             const response = await fetch(UPLOAD_URL, {
        //                 method: 'POST',
        //                 body: signedThumbnailForm(thumbnail, timestamp, folderPath)
        //             });

        //             cloudinary_res = await response.json();
        //         }

        //         const newAlbum = await prisma.album.create({
        //             data: {
        //                 title,
        //                 description,
        //                 path: folder.path,
        //                 archive: download_url,
        //                 hidden,
        //                 slug,
        //                 images: {
        //                     create: imagesData
        //                 },
        //                 thumbnail: cloudinary_res
        //                     ? {
        //                         create: {
        //                             path: cloudinary_res.secure_url as string,
        //                             cloudinaryAssetId: cloudinary_res.asset_id as string,
        //                             cloudinaryPublicId: cloudinary_res.public_id as string,
        //                             width: cloudinary_res.width as number,
        //                             height: cloudinary_res.height as number,
        //                             format: cloudinary_res.format as string,
        //                             size: cloudinary_res.bytes as number
        //                         }
        //                     }
        //                     : {}
        //             }
        //         });

        //         return {
        //             ok: true,
        //             message: `Album with ID ${newAlbum.id} created successfully.`,
        //             signature: '',
        //             data: {
        //                 album: newAlbum
        //             }
        //         };
        //     }
        // } catch (e) {
        //     console.error(e);

        //     return {
        //         ok: false,
        //         message: `Failed to create album: ${e}`,
        //     };
        // }

        return { ok: false };
    }
};