import { failure, log, ok, unwrap } from "$lib/apihelper";
import type { AlbumCreateForm, CloudinaryUploadResponse, ApiResponse, Album, AlbumEditParams, Thumbnail } from "$lib/type";
import ImageClientAPI from "./image";
import ThumbnailClientAPI from "./thumbnail";

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

            const response = await fetch('/api/album', {
                method: 'POST',
                body: JSON.stringify({
                    images,
                    thumbnail,
                    form,
                })
            });

            const album = await response.json() as ApiResponse<Album>;

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

            const response = await fetch('/api/album', {
                method: 'PATCH',
                body: JSON.stringify({
                    ...update,
                    thumbnail
                })
            });

            const album = await response.json() as ApiResponse<Album>;

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
            const response = await fetch('/api/album', {
                method: 'DELETE',
                body: JSON.stringify(id)
            });

            const album = await response.json() as ApiResponse<Album>;

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
