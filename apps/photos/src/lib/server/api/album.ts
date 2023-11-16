import { failure, ok, unwrap } from "$lib/apihelper";
import type { Album, ApiResponse, CreateAlbumData } from "$lib/type";
import cloudinary from "../cloudinary";
import prisma from "../prisma";
import { convertImageResults } from "$lib/api/image";

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

            // only error response contains the 'success' field
            const hasThumbnail = !!thumbnail && !('success' in thumbnail)

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
                        create: {
                            cloudinaryPublicId: thumbnail.public_id,
                            cloudinaryAssetId: thumbnail.asset_id,
                            format: thumbnail.format,
                            size: thumbnail.bytes,
                            width: thumbnail.width,
                            height: thumbnail.height,
                            path: thumbnail.secure_url
                        }
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
                await cloudinary.api.delete_resources([album.thumbnail.cloudinaryPublicId]);
                await cloudinary.api.delete_folder(album.path + '/thumbnail');
            }

            if (album.images.length > 0) {
                await cloudinary.api.delete_resources(album.images.map(image => image.cloudinaryPublicId));
                await cloudinary.api.delete_folder(album.path);
            }

            return ok({
                data: album,
            });
        } catch (error) {
            return failure({
                message: unwrap(error),
                source: 'server'
            })
        }
    },
    // edit: async (): ServerApiResponse<Album> => {}
};
