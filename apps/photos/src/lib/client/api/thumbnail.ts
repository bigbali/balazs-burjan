import type { ApiResponse as ApiResponse, CloudinaryApiResponse, CloudinaryFailure, Failure, Image, CloudinaryUploadResponse, ImageDeletedResponse, ThumbnailCreateParams, ThumbnailEditParams, ThumbnailDeleteParams, Thumbnail } from "$lib/type"
import { fetchSignature } from "../signature"
import { CLOUDINARY } from '$lib/cloudinary';
import { signedForm } from "$lib/form";
import { failure, log, ok, pretty, unwrap } from "$lib/apihelper";

export default class ThumbnailClientAPI {
    static async create({ album, thumbnail }: ThumbnailCreateParams<'client'>) {
        try {
            if (!thumbnail.file) throw Error('Borítókép nem található!');

            const folder = `photos/${album.title}/thumbnail/`;

            const { signature, timestamp } = await fetchSignature({ folder, tags: 'thumbnail' });

            const rawCloudinaryResponse = await fetch(`${CLOUDINARY}/image/upload`, {
                method: 'POST',
                body: signedForm(thumbnail.file, timestamp, signature, folder, 'thumbnail'),
            });

            const cloudinaryResponse = await rawCloudinaryResponse.json() as CloudinaryUploadResponse;

            if (!rawCloudinaryResponse.ok) {
                throw Error(pretty(cloudinaryResponse));
            }

            return ok({
                message: 'Borítókép sikeresen létrehozva.',
                data: cloudinaryResponse
            });
        } catch (error) {
            return failure({
                message: 'Borítókép létrehozása sikertelen.',
                error: unwrap(error),
                source: 'client'
            });
        }
    }

    // static async update({ album, thumbnail }: ThumbnailUpdateParams<'client'>) {
    //     try {
    //         const createNew = await this.create({
    //             album,
    //             thumbnail
    //         });

    //         if (!createNew.ok) {
    //             return failure(createNew);
    //         }

    //         const replaceOld = await fetch('/api/thumbnail', {
    //             method: 'PATCH',
    //             body: JSON.stringify({
    //                 data: createNew.data,
    //             })
    //         });

    //         const newThumbnail = await replaceOld.json() as ApiResponse<Thumbnail>;

    //         if (!newThumbnail.ok) {
    //             return failure(newThumbnail);
    //         }

    //         return ok({
    //             message: 'Kép sikeresen létrehozva.',
    //             data: newThumbnail.data
    //         });
    //     } catch (error) {
    //         return failure({
    //             message: 'Kép létrehozása sikertelen.',
    //             error: unwrap(error),
    //             source: 'client'
    //         });
    //     }
    // }
}
