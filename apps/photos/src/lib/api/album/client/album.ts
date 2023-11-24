import type { ApiResponse, CloudinaryUploadResponse } from '$lib/api';
import type { Album } from '$lib/type';
import { DELETE, PATCH, POST, failure, unwrap } from '$lib/util/apihelper';
import type { AlbumCreateForm, AlbumEditParams, AlbumGenerateArchiveParams } from '..';
import ImageClientAPI from '../../image/client/image';
import ThumbnailClientAPI from '../../thumbnail/client/thumbnail';

export default class AlbumClientAPI {
    // todo createalbumparams<client>
    static async create(form: AlbumCreateForm) {
        try {
            const images: { name: string, result: ApiResponse<CloudinaryUploadResponse> }[] = [];
            let thumbnail!: ApiResponse<CloudinaryUploadResponse>;

            if (form.images) {
                for (const img of form.images) {
                    const imageResult = await ImageClientAPI.initialize({
                        album: {
                            title: form.title
                        },
                        image: {
                            file: img
                        }
                    });

                    images.push({
                        name: img.name,
                        result: imageResult
                    });
                }
            }

            if (form.thumbnail?.length) {
                thumbnail = await ThumbnailClientAPI.create({
                    album: {
                        title: form.title
                    },
                    thumbnail: {
                        file: form.thumbnail[0]
                    }
                });
            }

            return await POST<ApiResponse<Album>>('album', {
                images,
                thumbnail,
                form
            });
        } catch (error) {
            return failure({
                message: 'Album létrehozása sikertelen',
                error: unwrap(error),
                source: 'client'
            });
        }
    }

    static async edit(form: AlbumEditParams<'client'>) {
        try {
            const { originalTitle, ...update } = form;
            let thumbnail: ApiResponse<CloudinaryUploadResponse> | undefined;

            if (form.thumbnail?.length) {
                thumbnail = await ThumbnailClientAPI.create({
                    album: {
                        title: originalTitle
                    },
                    thumbnail: {
                        file: form.thumbnail[0]
                    }
                });
            }

            return await PATCH<ApiResponse<Album>>('album', { ...update, thumbnail });
        } catch (error) {
            return failure({
                message: 'Album módosítása sikertelen',
                error: unwrap(error),
                source: 'client'
            });
        }
    }

    static async generateArchive(params: AlbumGenerateArchiveParams<'client'>) {
        try {
            return await POST<ApiResponse<Album>>('album', { ...params, generateArchive: true });
        } catch (error) {
            return failure({
                message: 'Hiba lépett fel az album törlése közben.',
                error: unwrap(error),
                source: 'client'
            });
        }
    }

    static async delete(id: number) {
        try {
            return await DELETE<ApiResponse<Album>>('album', id);
        } catch (error) {
            return failure({
                message: 'Hiba lépett fel az album törlése közben.',
                error: unwrap(error),
                source: 'client'
            });
        }
    }
}
