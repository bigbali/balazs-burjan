import { formatImageResponse } from "$lib/api/image";
import { collectCloudinary, failure, ok, okish, unwrap } from "$lib/apihelper";
import type { ApiResponse, CloudinaryError, ServerImageCreateParams, Thumbnail, ThumbnailCreateParams } from "$lib/type";
import cloudinary from "../cloudinary";
import prisma from "../prisma";

export default class ThumbnailServerAPI {
    static async create({ album, thumbnail }: ThumbnailCreateParams<'server'>): Promise<ApiResponse<Thumbnail>> {
        try {
            const id = Number.parseInt(album.id);

            const response = await prisma.album.update({
                where: {
                    id
                },
                select: {
                    thumbnail: true
                },
                data: {
                    thumbnail: {
                        create: {
                            ...formatImageResponse(thumbnail.data)
                        }
                    }
                }
            })

            return ok({
                data: response.thumbnail!
            });
        } catch (error) {
            return failure({
                message: 'Borítókép törlése sikertelen.',
                source: 'server',
                error: unwrap(error)
            })
        }
    }

    static async delete(id: string): Promise<ApiResponse<Thumbnail>> {
        try {
            const thumbnail = await prisma.thumbnail.delete({
                where: {
                    id: Number.parseInt(id)
                },
                include: {
                    album: true
                }
            });

            const results: unknown[] = [];
            const errors: CloudinaryError[] = [];

            results.push(...await collectCloudinary([
                cloudinary.api.delete_resources([thumbnail.cloudinaryPublicId]),
                cloudinary.api.delete_folder(thumbnail.folder)
            ], errors));

            if (errors.length > 0) {
                return okish({
                    data: thumbnail,
                    warnings: errors,
                    message: 'Borítókép sikeresen törölve, de hiba lépett fel a Cloudinary oldalán.'
                })
            }

            return ok({
                message: `'${thumbnail.album.title}' borítója sikeresen törölve.`,
                data: thumbnail
            })
        } catch (error) {
            return failure({
                source: 'server',
                error: unwrap(error),
                message: 'Borítókép törlése sikertelen.'
            })
        }
    }
};
