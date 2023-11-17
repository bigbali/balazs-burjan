import { formatImageResponse } from "$lib/api/image";
import { failure, ok, unwrap } from "$lib/apihelper";
import type { ServerImageCreateParams, Image, ApiResponse } from "$lib/type";
import cloudinary from "../cloudinary";
import prisma from "../prisma";

export default {
    create: async ({ albumId, title, description, thumbnail, data }: ServerImageCreateParams): Promise<ApiResponse<Image>> => {
        try {
            const id = Number.parseInt(albumId);

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
                    images: thumbnail
                        ? undefined
                        : {
                            create: {
                                title,
                                description,
                                ...formatImageResponse(data)
                            }
                        },
                    thumbnail: thumbnail
                        ? {
                            create: {
                                ...formatImageResponse(data)
                            }
                        }
                        : undefined
                }
            })

            return ok({
                data: images.images[0]
            });
        } catch (error) {
            return failure({
                message: unwrap(error),
                source: 'server'
            })
        }
    },
    delete: async (id: string) => {
        try {
            const image = await prisma.image.delete({
                where: {
                    id: Number.parseInt(id)
                }
            })

            await cloudinary.uploader.destroy(image.cloudinaryPublicId);

            return ok({
                message: `Kép [${image.id}] sikeresen törölve.`,
                data: image
            })
        } catch (error) {
            return failure({
                source: 'server',
                reason: unwrap(error),
                message: 'Kép törlése sikertelen.'
            })
        }
    }
};
