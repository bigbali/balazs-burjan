import { fetchSignature } from '../../../client/signature';
import { CLOUDINARY } from '$lib/util/cloudinary';
import { signedForm } from '$lib/util/form';
import { failure, ok, pretty, unwrap } from '$lib/util/apihelper';
import type { ThumbnailCreateParams } from '..';
import type { CloudinaryUploadResponse } from '$lib/api';

export default class ThumbnailClientAPI {
    static async create({ album, thumbnail }: ThumbnailCreateParams<'client'>) {
        try {
            if (!thumbnail.file) throw Error('Borítókép nem található!');

            const folder = `photos/${album.title}/thumbnail/`;

            const { signature, timestamp } = await fetchSignature({ folder, tags: 'thumbnail' });

            const rawCloudinaryResponse = await fetch(`${CLOUDINARY}/image/upload`, {
                method: 'POST',
                body: signedForm(thumbnail.file, timestamp, signature, folder, 'thumbnail')
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
}
