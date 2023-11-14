import cloudinary, { UPLOAD_URL, signedImageForm, signedThumbnailForm, timestamp } from '$lib/server/cloudinary';
import prisma from '$lib/server/prisma';
import type { Album, CloudinaryImageResponse, Image } from '$lib/type.js';
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

const deleteImages = async (ids: string[], folder?: string) => {
    await cloudinary.api.delete_resources(ids);

    if (folder) {
        await cloudinary.api.delete_folder(folder);
    }
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

            return { ok: true, message: `Album with ID ${id} edited successfully.`, album }
        } catch (err) {
            console.error(err);

            return { ok: false, message: `Failed to edit album with ID ${id}.` }
        }
    },
    'delete-album': async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;

        let album: Album;

        try {
            album = await prisma.album.delete({
                where: { id: Number.parseInt(id) },
                include: { images: true, thumbnail: true }
            });

            if (album.thumbnail) {
                await deleteImages([album.thumbnail.cloudinaryPublicId], `${album.path}/thumbnail`);
            }

            await deleteImages(album.images.map((entry) => entry.cloudinaryPublicId), album.path);
        } catch (err) {
            console.error(err);

            return { ok: false, message: `Failed to delete album with ID ${id}.` }
        }

        throw redirect(300, '/admin')
    },
    'edit-image': async ({ request }) => {
        const data = await request.formData();

        const id = data.get('img-id') as string;
        const title = data.get('title') as string;
        const description = data.get('description') as string;

        let image: Image;

        try {
            image = await prisma.image.update({
                where: { id: Number.parseInt(id) },
                data: {
                    title,
                    description
                }
            });
        } catch (err) {
            console.error(err);

            return { ok: false, message: `Failed to edit image with ID ${id}.` }
        }

        return { ok: true, message: `Image with ID ${id} edited successfully.`, image }
    },
    'delete-image': async ({ request }) => {
        const data = await request.formData();
        const id = data.get('img-id') as string;

        let image: Image;

        try {
            image = await prisma.image.delete({
                where: { id: Number.parseInt(id) }
            });

            await deleteImages([image.cloudinaryPublicId]);
        } catch (err) {
            console.error(err);

            return { ok: false, message: `Failed to delete image with ID ${id}.` }
        }

        return { ok: true, message: `Image with ID ${id} deleted successfully.`, image }
    },
    'add-image': async ({ request }) => {
        const data = await request.formData();

        const albumId = data.get('album-id') as string;
        const albumPath = data.get('album-path') as string;
        const title = data.get('title') as string;
        const description = data.get('description') as string;
        const image = data.get('image') as File;

        if (image.size === 0) return;

        let newImage: Image;

        const response = await fetch(UPLOAD_URL, {
            method: 'POST',
            body: signedImageForm(image, timestamp(), albumPath)
        });

        const res = await response.json();

        try {
            const album = await prisma.album.update({
                where: {
                    id: Number.parseInt(albumId)
                },
                include: {
                    images: {
                        orderBy: {
                            createdAt: 'desc'
                        }
                    }
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

            newImage = album.images[0];
        } catch (err) {
            console.error(err);

            return { ok: false, message: 'Failed to create image.' }
        }

        return { ok: true, message: `Image with ID ${albumId} created successfully.`, image }
    }
};