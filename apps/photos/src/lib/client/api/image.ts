import type { ApiResponse as ApiResponse, CloudinaryApiResponse, CloudinaryFailure, Failure, Image, ImageCreatedResponse, ImageDeletedResponse } from "$lib/type"
import { fetchSignature } from "../signature"
import { CLOUDINARY } from '$lib/cloudinary';
import { signedForm } from "$lib/form";
import { failure, log, ok, pretty, unwrap } from "$lib/apihelper";

export type ClientImageInitializeParams = {
    image: File,
    albumTitle: string,
    thumbnail?: boolean,
}

export type ClientImageCreateParams = {
    image: File,
    albumId: string,
    albumPath: string,
    title?: string,
    description?: string,
    thumbnail?: boolean,
}

type ClientImageDeleteParams = {
    id: number
}

export type ClientImageApi = {
    /**  Uploads images when creating the album. Runs entirely on client. */
    initialize: (params: ClientImageInitializeParams) => Promise<ApiResponse<ImageCreatedResponse>>,
    /**  Uploads images when adding to an already existing album. Invokes server. */
    create: (params: ClientImageCreateParams) => Promise<ApiResponse<Image>>,
    delete: (params: ClientImageDeleteParams) => Promise<ApiResponse<Image>>
}

export const image: ClientImageApi = {
    initialize: async ({
        image,
        albumTitle,
        thumbnail = false
    }) => {
        try {
            if (!image) throw Error('Kép nem található!');

            const folder = `photos/${albumTitle}/${thumbnail ? 'thumbnail/' : ''}`;
            const tags = thumbnail ? 'thumbnail' : 'image';

            const { signature, timestamp } = await fetchSignature({ folder, tags });

            const rawCloudinaryResponse = await fetch(`${CLOUDINARY}/image/upload`, {
                method: 'POST',
                body: signedForm(image, timestamp, signature, folder, tags),
            });

            // could be 'success: false'
            const cloudinaryResponse = await rawCloudinaryResponse.json() as ImageCreatedResponse;

            if (!rawCloudinaryResponse.ok) {
                throw Error(pretty(cloudinaryResponse));
            }

            return ok({
                message: 'Kép sikeresen létrehozva.',
                data: cloudinaryResponse
            });
        } catch (error) {
            return failure({
                message: 'Kép létrehozása sikertelen.',
                reason: unwrap(error),
                source: 'client'
            });
        }
    },
    create: async ({
        image,
        albumId,
        albumPath,
        title,
        description,
        thumbnail = false
    }) => {
        try {
            if (!image) throw Error('Kép nem található!');

            const folder = `${albumPath}/${thumbnail ? 'thumbnail/' : ''}`;
            const tags = thumbnail ? 'thumbnail' : 'image';

            const { signature, timestamp } = await fetchSignature({ folder, tags });

            const rawCloudinaryResponse = await fetch(`${CLOUDINARY}/image/upload`, {
                method: 'POST',
                body: signedForm(image, timestamp, signature, folder, tags),
            });

            const cloudinaryResponse = await rawCloudinaryResponse.json() as CloudinaryApiResponse<ImageCreatedResponse>

            if (!rawCloudinaryResponse.ok) {
                throw Error(pretty(cloudinaryResponse));
            }

            const rawServerResponse = await fetch('/api/image', {
                method: 'POST',
                body: JSON.stringify({
                    albumId,
                    albumPath,
                    title,
                    description,
                    thumbnail,
                    data: cloudinaryResponse,
                })
            });

            const imageResponse = await rawServerResponse.json() as ApiResponse<Image>;

            if (!imageResponse.ok) {
                return failure({ ...imageResponse } as Failure);
            }

            return ok({
                message: 'Kép sikeresen létrehozva.',
                data: imageResponse.data
            });
        } catch (error) {
            return failure({
                message: 'Kép létrehozása sikertelen.',
                reason: unwrap(error),
                source: 'client'
            });
        }
    },
    delete: async ({ id }) => {
        const response = await fetch('/api/image', {
            method: 'DELETE',
            body: JSON.stringify(id)
        });

        return await response.json();
    }
}
