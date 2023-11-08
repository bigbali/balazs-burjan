import cloudinary, { UPLOAD_URL, signedImageForm, signedThumbnailForm, timestamp } from '$lib/server/cloudinary';
import prisma from '$lib/server/prisma';
import type { CloudinaryImageResponse } from '$lib/type.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
    const session = await locals.getSession();

    if (session?.user.role !== 'admin') {
        throw redirect(302, '/');
    }

    const album = await prisma.album.findFirst({
        where: {
            slug: {
                equals: params.album
            }
        },
        include: {
            images: true,
            thumbnail: true
        }
    });

    return {
        album
    };
};

const replaceThumbnail = async (thumbId: string, newThumbnail: File, albumId: number, albumPath: string) => {
    await cloudinary.uploader.destroy(thumbId);

    const folderPath = `${albumPath}/thumbnail`;

    const response = await fetch(UPLOAD_URL, {
        method: 'POST',
        body: signedThumbnailForm(newThumbnail, timestamp(), folderPath)
    });

    return await response.json() as CloudinaryImageResponse;
};

export const actions = {
    'edit-album': async ({ request }) => {
        const data = await request.formData();

        const id = data.get('id') as string;
        const path = data.get('path') as string;
        const thumbPublicId = data.get('thumbpid') as string;
        const thumbId = data.get('thumbid') as string;
        const title = (data.get('title') as string).replace(/ /g, '_');
        const description = data.get('description') as string;
        const slug = data.get('slug') as string;
        const date = data.get('date') as string;
        const hidden = !!data.get('hidden');
        const thumbnail = data.get('thumbnail') as File;

        const albumId = Number.parseInt(id);

        try {
            let album;

            if (thumbnail.size > 0) {
                const newThumbnail = await replaceThumbnail(thumbPublicId, thumbnail, albumId, path);

                const newThumbnailData = {
                    cloudinaryAssetId: newThumbnail.asset_id,
                    cloudinaryPublicId: newThumbnail.public_id,
                    path: newThumbnail.secure_url,
                    format: newThumbnail.format,
                    size: newThumbnail.bytes,
                    width: newThumbnail.width,
                    height: newThumbnail.height
                };

                album = await prisma.album.update({
                    where: {
                        id: albumId
                    },
                    data: {
                        title,
                        description,
                        slug,
                        date: new Date(date),
                        hidden,
                        thumbnail: {
                            upsert: {
                                where: {
                                    id: Number.parseInt(thumbId)
                                },
                                create: newThumbnailData,
                                update: newThumbnailData
                            }
                        }
                    }
                });
            } else {
                album = await prisma.album.update({
                    where: {
                        id: albumId
                    },
                    data: {
                        title,
                        description,
                        slug,
                        date: new Date(date),
                        hidden
                    }
                });
            }

            return {
                ok: true,
                album
            };


        } catch (err) {
            console.error(err);
            return { ok: false };
        }
    },
    'edit-image': async ({ request }) => {
        const data = await request.formData();

        const id = data.get('img-id') as string;
        const title = data.get('title') as string;
        const description = data.get('description') as string;

        // todo if new image then delete old from cloudinary and db then create new
        try {
            await prisma.image.update({
                where: { id: Number.parseInt(id) },
                data: {
                    title,
                    description
                }
            });
        } catch (err) {
            console.error(err);
        }
    },
    'delete-image': async ({ request }) => {
        const data = await request.formData();
        const id = data.get('img-id') as string;

        try {
            await prisma.image.delete({
                where: { id: Number.parseInt(id) }
            });
        } catch (err) {
            console.error(err);
        }
    },
    'add-image': async ({ request }) => {
        const data = await request.formData();

        const albumId = data.get('album-id') as string;
        const albumPath = data.get('album-path') as string;
        const title = data.get('title') as string;
        const description = data.get('description') as string;
        const image = data.get('image') as File;

        if (image.size === 0) return;

        const response = await fetch(UPLOAD_URL, {
            method: 'POST',
            body: signedImageForm(image, timestamp(), albumPath)
        });

        const res = await response.json();

        console.log(image);

        try {
            await prisma.album.update({
                where: {
                    id: Number.parseInt(albumId)
                },
                data: {
                    images: {
                        create: {
                            title,
                            description,
                            path: res.secure_url as string,
                            cloudinaryAssetId: res.asset_id as string,
                            cloudinaryPublicId: res.public_id as string,
                            width: res.width as number,
                            height: res.height as number,
                            format: res.format as string,
                            size: res.bytes as number
                        }
                    }
                }
            });
        } catch (err) {
            console.error(err);
        }
    }
};