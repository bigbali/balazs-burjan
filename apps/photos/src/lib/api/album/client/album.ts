import type { ApiResponse, CloudinaryUploadResponse } from "$lib/api";
import type { Album } from "$lib/type";
import { DELETE, PATCH, POST, failure, ok, unwrap } from "$lib/util/apihelper";
import type { AlbumCreateForm, AlbumEditParams } from "..";
import ImageClientAPI from "../../image/client/image";
import ThumbnailClientAPI from "../../thumbnail/client/thumbnail";

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

            const album = await POST<ApiResponse<Album>>('album', {
                images,
                thumbnail,
                form,
            })

            if (!album.ok) {
                return failure({ ...album })
            }

            return ok({
                message: 'Album sikeresen létrehozva',
                data: album.data
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
                        title: originalTitle,
                    },
                    thumbnail: {
                        file: form.thumbnail[0]
                    }
                });
            }

            const album = await PATCH<ApiResponse<Album>>('album', { ...update, thumbnail })

            if (!album.ok) {
                return failure(album);
            }

            return ok({
                message: 'Album sikeresen módosítva.',
                data: album.data
            });
        } catch (error) {
            return failure({
                message: 'Album módosítása sikertelen',
                error: unwrap(error),
                source: 'client'
            });
        }
    }

    static async delete(id: number) {
        try {
            const album = await DELETE<ApiResponse<Album>>('album', id)

            if (!album.ok) {
                return failure({ ...album });
            }

            if ('warnings' in album) {
                return album;
            }

            return ok({
                message: `Album '${album.data.title}' sikeresen törölve.`,
                data: album.data
            });
        } catch (error) {
            return failure({
                message: 'Hiba lépett fel az album törlése közben.',
                error: unwrap(error),
                source: 'client'
            });
        }
    }
}
