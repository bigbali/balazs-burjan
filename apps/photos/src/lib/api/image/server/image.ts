import { formatImageResponse, type ImageCreateParams, type ImageDeleteParams, type ImageEditParams } from "$lib/api/image";
import { failure, ok, unwrap } from "$lib/util/apihelper";
import cloudinary from "../../../server/cloudinary";
import prisma from "../../../server/prisma";
import type { ApiResponse } from "$lib/api";
import type { Image } from "$lib/type";

/**
 * Handles database and Cloudinary Admin API operations for images.
 */
export default class ImageServerAPI {
    static async create({ album, image }: ImageCreateParams<'server'>): Promise<ApiResponse<Image>> {
        const { title, description, data } = image;

        try {
            const id = Number.parseInt(album.id);

            const images = await prisma.album.update({
                where: {
                    id
                },
                select: { // select only the latest image
                    images: {
                        orderBy: {
                            createdAt: 'desc'
                        },
                        take: 1,
                    },
                },
                data: {
                    images: {
                        create: {
                            title,
                            description,
                            ...formatImageResponse(data)
                        }
                    }
                }
            })

            return ok({
                data: images.images[0]
            });
        } catch (error) {
            return failure({
                message: 'Kép létrehozása sikertelen.',
                error: unwrap(error),
                source: 'server'
            })
        }
    }

    static async edit({ id, ...params }: ImageEditParams<'server'>) {
        try {
            const image = await prisma.image.update({
                where: {
                    id: Number.parseInt(id)
                },
                data: {
                    ...params
                }
            })

            return ok({
                message: 'Kép sikeresen módosítva.',
                data: image
            })
        } catch (error) {
            return failure({
                source: 'server',
                error,
                message: 'Kép módosítása sikertelen.'
            })
        }
    }

    static async delete({ id }: ImageDeleteParams<'server'>): Promise<ApiResponse<Image>> {
        try {
            const image = await prisma.image.delete({
                where: {
                    id: Number.parseInt(id)
                }
            });

            await cloudinary.uploader.destroy(image.cloudinaryPublicId);

            return ok({
                message: `Kép [${image.id}] sikeresen törölve.`,
                data: image
            })
        } catch (error) {
            return failure({
                source: 'server',
                error: unwrap(error),
                message: 'Kép törlése sikertelen.'
            })
        }
    }
};
