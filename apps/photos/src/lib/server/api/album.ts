import { failure, ok, pretty, unwrap } from "$lib/apihelper";
import type { Album, ApiResponse, CreateAlbumData } from "$lib/type";
import cloudinary from "../cloudinary";
import prisma from "../prisma";
import { convertImageResults, formatImageResponse } from "$lib/api/image";

export default {
    create: async ({ form, images, thumbnail }: CreateAlbumData['data']): Promise<ApiResponse<Album>> => {
        try {
            const {
                title,
                slug,
                description,
                date,
                hidden
            } = form;

            const hasThumbnail = !!thumbnail && thumbnail.ok

            const album = await prisma.album.create({
                include: {
                    images: true,
                    thumbnail: true
                },
                data: {
                    title,
                    slug,
                    description,
                    hidden,
                    date,
                    path: `photos/${title}`,
                    images: {
                        create: convertImageResults(images)
                    },
                    thumbnail: hasThumbnail ? {
                        create: formatImageResponse(thumbnail.data)
                    } : undefined
                }
            });

            return ok({
                data: album,
            });
        } catch (error) {
            return failure({
                message: unwrap(error),
                source: 'server'
            });
        }
    },
    delete: async (id: string | number): Promise<ApiResponse<Album>> => {
        const errors = [];

        try {
            if (typeof id === 'string') {
                id = Number.parseInt(id);
            }

            const album = await prisma.album.delete({
                include: {
                    images: true,
                    thumbnail: true
                },
                where: {
                    id
                }
            })

            if (album.thumbnail) {
                const res = await cloudinary.api.delete_resources([album.thumbnail.cloudinaryPublicId]);
                const folder = await cloudinary.api.delete_folder(album.path + '/thumbnail');

                if (res.error) {
                    errors.push(res);
                }

                if (folder.error) {
                    errors.push(folder);
                }
            }

            if (album.images.length > 0) {
                const res = await cloudinary.api.delete_resources(album.images.map(image => image.cloudinaryPublicId));
                const folder = await cloudinary.api.delete_folder(album.path);

                if (res.error) {
                    errors.push(res);
                }

                if (folder.error) {
                    errors.push(folder);
                }
            }

            if (errors.length > 0) {
                return failure({
                    message: 'Cloudinary hiba.',
                    source: 'server',
                    reason: pretty(errors)
                })
            }

            return ok({
                data: album,
            });
        } catch (error) {
            return failure({
                message: unwrap(error),
                source: 'server',
            })
        }
    },
    // edit: async (): ServerApiResponse<Album> => {}
};
