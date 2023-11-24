import { fetchSignature } from '../../../client/signature';
import { CLOUDINARY } from '$lib/util/cloudinary';
import { signedForm } from '$lib/util/form';
import { failure, ok, pretty, unwrap, DELETE, PATCH, POST } from '$lib/util/apihelper';
import type { Image } from '$lib/type';
import type { ImageCreateParams, ImageDeleteParams, ImageEditParams, ImageInitializeParams } from '..';
import type { ApiResponse, CloudinaryUploadResponse, Failure } from '$lib/api';

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
                body: signedForm(image.file, timestamp, signature, folder, 'image')
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

            const imageResponse = await POST<ApiResponse<Image>, ImageCreateParams<'server'>>('image', {
                album: {
                    id: album.id.toString()
                },
                image: {
                    title: image.title,
                    description: image.description,
                    data: response.data
                }
            });

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
            });
        }
        catch (error) {
            return failure({
                source: 'client',
                error,
                message: 'Kép törlése sikertelen.'
            });
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
