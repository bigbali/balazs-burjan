import { PUBLIC_CLOUDINARY_CLOUD_NAME } from "$env/static/public";
import { signedFolderForm, signedForm } from "$lib/form";
import { DbActionType, type CloudinaryApiResponse, type CreateAlbumForm, type Failure, type FolderCreatedResponse, type FolderDeletedResponse, type ImageCreatedResponse, type ImageDeletedResponse, type ImageResult, type Signature, type Album } from "$lib/type";
import { fetchSignature } from "./signature";

const CLOUDINARY = `https://api.cloudinary.com/v1_1/${PUBLIC_CLOUDINARY_CLOUD_NAME}`;

type CreateFolder = {
    path: string
};

type DeleteFolder = CreateFolder;


type FolderApi = {
    create: (params: CreateFolder) => Promise<FolderCreatedResponse | Failure>,
    delete: (params: DeleteFolder) => Promise<FolderDeletedResponse | Failure>
}

const folder: FolderApi = {
    create: async ({ path }) => {
        const folderPath = `photos/${path}`;

        const sign = await fetch('/api/signature', {
            method: 'POST',
            body: JSON.stringify({ path: folderPath })
        });

        const { signature, timestamp } = await sign.json();

        const response = await fetch(`${CLOUDINARY}/folders/${path}`, {
            method: 'POST',
            body: signedFolderForm(timestamp, signature, folderPath)
        });

        return response.json();
    },
    delete: async ({ path }) => {
        const response = await fetch(`${CLOUDINARY}/folders/photos/${path}`, {
            method: 'DELETE',
        });

        return await response.json();
    }
}

type CreateImage = {
    album: string,
    image: File,
    thumbnail?: boolean,
}

type DeleteImage = {
    publicId: string,
}

type ImageApi = {
    create: (params: CreateImage) => Promise<ImageCreatedResponse | Failure>,
    delete: (params: DeleteImage) => Promise<ImageDeletedResponse | Failure>
}

const image: ImageApi = {
    create: async ({
        image,
        album,
        thumbnail = false
    }) => {
        const folder = `photos/${album}/${thumbnail ? 'thumbnail/' : ''}`;
        const tags = thumbnail ? 'thumbnail' : 'image';

        const { signature, timestamp } = await fetchSignature({ folder, tags });

        const response = await fetch(`${CLOUDINARY}/image/upload`, {
            method: 'POST',
            body: signedForm(image, timestamp, signature, folder, tags),
        });

        return await response.json();
    },
    delete: async ({ publicId }) => {
        // todo THIS YO
        const response = await fetch(`${CLOUDINARY}/resource/image/upload?public_ids=${publicId}`, {
            method: 'DELETE',
        });

        return await response.json();
    }
}


type AlbumApi = {
    create: (form: CreateAlbumForm) => Promise<CloudinaryApiResponse<Album>>
};


const album: AlbumApi = {
    create: async (form) => {
        try {
            const images: ImageResult[] = [];
            let thumbnail: ImageCreatedResponse | Failure | null = null;

            if (form.images) {
                for (const img of form.images) {
                    const imageResult = await image.create({ album: form.title, image: img });

                    images.push({
                        name: img.name,
                        result: imageResult
                    })
                }
            }

            if (form.thumbnail?.length) {
                thumbnail = await image.create({ album: form.title, image: form.thumbnail[0], thumbnail: true })
            }

            const prismaResponse = await fetch('/api/db', {
                method: 'POST',
                body: JSON.stringify({
                    type: DbActionType.CREATE_ALBUM,
                    data: {
                        images,
                        thumbnail,
                        form,
                    }
                })
            })

            return {
                ok: true,
                message: `Created album with title '${form.title}'.`,
                data: {
                    ...await prismaResponse.json()
                }
            }
        } catch (e) {
            let message;

            if (typeof e === 'string') {
                message = e;
            } else if (e instanceof Error) {
                message = e.message;
            }

            // todo if failure then delete stuff
            return {
                ok: false,
                message
            }
        }
    }
}

const api = {
    album,
    image
};

export default api;