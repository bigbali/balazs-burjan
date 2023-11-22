import type { ApiResponse as ApiResponse, Failure, Image, CloudinaryUploadResponse, ImageCreateParams, ImageInitializeParams, ImageDeleteParams, ImageEditParams } from "$lib/type"
import { fetchSignature } from "../signature"
import { CLOUDINARY } from '$lib/cloudinary';
import { signedForm } from "$lib/form";
import { failure, log, ok, pretty, unwrap, requestBody, DELETE, PATCH } from "$lib/apihelper";

export default class ImageClientAPI {
    /** Uploads an image to Cloudinary and returns the response. */
    static async initialize({ album, image }: ImageInitializeParams): Promise<ApiResponse<CloudinaryUploadResponse>> {
        try {
            if (!image.file) throw Error('Kép nem található!');

            // @ts-ignore
            const folder = (album.folder ?? `photos/${album.title}/`) as string;

            const { signature, timestamp } = await fetchSignature({ folder, tags: 'image' });

            const rawCloudinaryResponse = await fetch(`${CLOUDINARY}/image/upload`, {
                method: 'POST',
                body: signedForm(image.file, timestamp, signature, folder, 'image'),
            });

            const cloudinaryResponse = await rawCloudinaryResponse.json() as CloudinaryUploadResponse;

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
                error: unwrap(error),
                source: 'client'
            });
        }
    }

    /** Creates an image on an already existing album. */
    static async create({ album, image }: ImageCreateParams<'client'>) {
        try {
            const response = await this.initialize({
                album: {
                    folder: album.path
                },
                image: {
                    file: image.file
                }
            });

            if (!response.ok) {
                return failure(response);
            }

            const fetchResponse = await fetch('/api/image', {
                method: 'POST',
                body: requestBody<ImageCreateParams<'server'>>({
                    album: {
                        id: album.id.toString()
                    },
                    image: {
                        title: image.title,
                        description: image.description,
                        data: response.data
                    }
                })
            });

            const imageResponse = await fetchResponse.json() as ApiResponse<Image>;

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
                error: unwrap(error),
                source: 'client'
            });
        }
    }

    /** Deletes an image identified by its ID. */
    static async delete({ id }: ImageDeleteParams<'client'>) {
        try {
            const response = await DELETE<ApiResponse<Image>, ImageDeleteParams<'client'>>('image', { id });

            if (!response.ok) {
                return failure(response);
            }

            return ok({
                message: 'Kép sikeresen törölve.',
                data: response.data
            })
        }
        catch (error) {
            return failure({
                source: 'client',
                error,
                message: 'Kép törlése sikertelen.'
            })
        }
    }

    static async edit(params: ImageEditParams<'client'>) {
        try {
            const response = await PATCH<ApiResponse<Image>>('image', params);

            if (!response.ok) {
                return failure(response);
            }

            return ok({
                message: 'Kép sikeresen módosítva.',
                data: response.data
            });
        } catch (error) {
            return failure({
                source: 'client',
                error,
                message: 'Kép módosítása sikertelen.'
            });
        }
    }
}
