import { failure, log, ok, unwrap } from "$lib/apihelper";
import type { CreateAlbumForm, ImageCreatedResponse, ApiResponse, Album } from "$lib/type";
import { image } from "./image";

export type AlbumApi = {
    create: (form: CreateAlbumForm) => Promise<ApiResponse<Album>>,
    delete: (id: number) => Promise<ApiResponse<Album>>,
};

export const album = {
    create: async (form: CreateAlbumForm) => {
        try {
            const images: { name: string, result: ApiResponse<ImageCreatedResponse> }[] = [];
            let thumbnail: ApiResponse<ImageCreatedResponse> | null = null;

            if (form.images) {
                for (const img of form.images) {
                    const imageResult = await image.initialize({ albumTitle: form.title, image: img });

                    images.push({
                        name: img.name,
                        result: imageResult
                    })
                }
            }

            log(images)

            if (form.thumbnail?.length) {
                thumbnail = await image.initialize({ albumTitle: form.title, image: form.thumbnail[0], thumbnail: true })
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
                reason: unwrap(error),
                source: 'client'
            });
        }
    },
    delete: async (id: number) => {
        try {
            const response = await fetch('/api/album', {
                method: 'DELETE',
                body: JSON.stringify(id)
            });

            const album = await response.json() as ApiResponse<Album>;

            if (!album.ok) {
                return failure({ ...album });
            }

            return ok({
                message: `Album '${album.data.title}' sikeresen törölve.`,
                data: album.data
            });
        } catch (error) {
            return failure({
                message: 'Hiba lépett fel az album törlése közben.',
                reason: unwrap(error),
                source: 'client'
            });
        }
    },
}
