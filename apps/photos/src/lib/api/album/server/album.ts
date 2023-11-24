import { collectCloudinary, failure, ok, okish, unwrap } from '$lib/util/apihelper';
import cloudinary from '../../../server/cloudinary';
import prisma from '../../../server/prisma';
import { convertImageResults, formatImageResponse } from '$lib/api/image';
import type { AlbumCreateParams, AlbumEditParams, AlbumGenerateArchiveParams } from '..';
import type { ApiResponse, CloudinaryError, CloudinaryUploadResponse } from '$lib/api';
import type { Album } from '$lib/type';

export default class AlbumServerAPI {
    static async create({ form, images, thumbnail }: AlbumCreateParams): Promise<ApiResponse<Album>> {
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
                    images: {
                        orderBy: {
                            createdAt: 'desc'
                        }
                    },
                    thumbnail: true,
                    archive: true
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
                data: album
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
                    cloudinary.api.delete_resources([albumBefore!.thumbnail!.cloudinaryPublicId])
                ], errors);
            }

            const album = await prisma.album.update({
                include: {
                    images: {
                        orderBy: {
                            createdAt: 'desc'
                        }
                    },
                    thumbnail: true,
                    archive: true
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
                data: album
            });
        } catch (error) {
            return failure({
                message: unwrap(error),
                source: 'server'
            });
        }
    }

    static async generateArchive(params: AlbumGenerateArchiveParams<'server'>): Promise<ApiResponse> {
        try {
            const errors: CloudinaryError[] = [];

            const album = await prisma.album.findFirst({
                where: {
                    id: Number.parseInt(params.id)
                },
                include: {
                    archive: true
                }
            });

            if (!album) {
                return failure({
                    source: 'server',
                    message: `Archívum létrehozása sikertelen: album [${params.id}] nem található.`
                })
            }

            if (album.archive?.cloudinaryPublicId) {
                await collectCloudinary([cloudinary.uploader.destroy(album.archive.cloudinaryPublicId)], errors);
            }

            const response = await cloudinary.uploader.create_zip({
                prefixes: album.path + '/',
                flatten_folders: true,
                tags: 'image'
            }) as CloudinaryUploadResponse<'archive'>;

            const updatedAlbum = await prisma.album.update({
                where: {
                    id: album.id
                },
                data: {
                    archive: {
                        upsert: {
                            create: {
                                cloudinaryPublicId: response.public_id,
                                source: response.secure_url
                            },
                            update: {
                                cloudinaryPublicId: response.public_id,
                                source: response.secure_url
                            }
                        }
                    }
                }
            });

            if (errors.length > 0) {
                return okish({
                    warnings: errors,
                    message: 'Archívum sikeresen létrehozva, de a régi archívum törlése sikertelen.',
                    data: updatedAlbum
                });
            }

            return ok({
                message: 'Archívum sikeresen létrehozva.',
                data: updatedAlbum
            });
        } catch (error) {
            return failure({
                source: 'server',
                error,
                message: 'Archívum létrehozása sikertelen.'
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
                    images: {
                        orderBy: {
                            createdAt: 'desc'
                        }
                    },
                    thumbnail: true,
                    archive: true
                },
                where: {
                    id
                }
            });

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
                data: album
            });
        } catch (error) {
            return failure({
                message: unwrap(error),
                source: 'server'
            });
        }
    }
}
