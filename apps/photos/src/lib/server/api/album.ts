import { collectCloudinary, failure, ok, okish, unwrap } from "$lib/apihelper";
import type { Album, ApiResponse, CloudinaryError, CreateAlbumData, AlbumEditParams } from "$lib/type";
import cloudinary from "../cloudinary";
import prisma from "../prisma";
import { convertImageResults, formatImageResponse } from "$lib/api/image";

export default class AlbumServerAPI {
    static async create({ form, images, thumbnail }: CreateAlbumData['data']): Promise<ApiResponse<Album>> {
        try {
            const {
                title,
                slug,
                description,
                date,
                hidden
            } = form;

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
                    thumbnail: thumbnail.ok ? {
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
    }

    static async delete(id: string | number): Promise<ApiResponse<Album>> {
        const errors: CloudinaryError[] = [];
        const results: unknown[] = [];

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
                results.push(...await collectCloudinary([
                    cloudinary.api.delete_resources([album.thumbnail.cloudinaryPublicId]),
                    cloudinary.api.delete_folder(album.path + '/thumbnail')
                ], errors));
            }

            if (album.images.length > 0) {
                results.push(...await collectCloudinary([
                    cloudinary.api.delete_resources(album.images.map(image => image.cloudinaryPublicId)),
                    cloudinary.api.delete_folder(album.path)
                ], errors));
            }

            if (errors.length > 0 && results.length === 0) {
                return failure({
                    message: 'Cloudinary hiba.',
                    source: 'server',
                    error: errors
                });
            } else if (errors.length > 0 && results.length > 0) {
                return okish({
                    data: album,
                    warnings: errors,
                    message: 'Album törölve, de hibák léptek fel.'
                });
            }

            return ok({
                data: album,
            });
        } catch (error) {
            return failure({
                message: unwrap(error),
                source: 'server'
            });
        }
    }

    static async edit(params: AlbumEditParams<'server'>): Promise<ApiResponse<Album>> {
        try {
            const {
                id, thumbnail, date: _date, hidden, ...updates
            } = params;

            let errors: CloudinaryError[] = [];

            const date = _date ? { date: new Date(_date) } : {};

            if (thumbnail?.ok) { // delete old thumbnail from cloud
                const albumBefore = await prisma.album.findFirst({
                    where: {
                        id: Number.parseInt(id)
                    },
                    include: {
                        thumbnail: true
                    }
                });

                await collectCloudinary([
                    cloudinary.api.delete_resources([albumBefore!.thumbnail!.cloudinaryPublicId]),
                ], errors);
            }

            const album = await prisma.album.update({
                include: {
                    images: true,
                    thumbnail: true
                },
                where: {
                    id: Number.parseInt(id)
                },
                data: {
                    ...updates,
                    ...date,
                    hidden: !!hidden,
                    thumbnail: thumbnail?.ok ? {
                        update: formatImageResponse(thumbnail.data)
                    } : undefined
                }
            });

            if (errors.length > 0) {
                return okish({
                    data: album,
                    warnings: errors,
                    message: 'Album frissítve, de a régi borítókép törlése a felhőből sikertelen.'
                });
            }

            return ok({
                data: album,
            });
        } catch (error) {
            return failure({
                message: unwrap(error),
                source: 'server'
            });
        }
    }
};
