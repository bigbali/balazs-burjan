import prisma from '$lib/server/prisma'
import { DbActionType, type ApiData, type CreateAlbumData, type ImageData, type ImageResult, type ImageCreatedResponse, type Image, type Album } from '$lib/type.js'
import { json } from '@sveltejs/kit'

export const POST = async ({ request }) => {
    const { type, data }: ApiData = await request.json();

    if (type === DbActionType.CREATE_ALBUM) {
        return json(await db.album.create({ ...data }));
    }

    return json('semmi');
}

const imageResultsToImageDatas = (images: ImageResult[]): ImageData[] => {
    return images.map<ImageData | null>(image => {
        if (!image.result) return null;
        const {
            secure_url,
            public_id,
            asset_id,
            bytes,
            format,
            width,
            height
        } = image.result as ImageCreatedResponse;

        return {
            path: secure_url,
            cloudinaryPublicId: public_id,
            cloudinaryAssetId: asset_id,
            size: bytes,
            format,
            width,
            height
        }
    }).filter((image) => image !== null) as ImageData[]
}

type DbApi = {
    album: {
        create: (param: CreateAlbumData['data']) => Promise<Album>,
        delete: (id: string | number) => Promise<Album>
    },
    image: {
        // create: (CreateImageData['data']) => Promise<Image>,
        // delete: () => Promise<Image>
    }
}

const db: DbApi = {
    album: {
        create: async ({ form, folder, images, thumbnail }) => {
            const {
                title,
                slug,
                description,
                date,
                hidden
            } = form;

            // only error response contains the 'success' field
            const hasThumbnail = !!thumbnail && !('success' in thumbnail)

            return await prisma.album.create({
                include: {
                    images: true,
                    thumbnail: true
                },
                data: {
                    title,
                    slug,
                    description,
                    hidden,
                    date,
                    path: `photos/${folder}`,
                    images: {
                        create: imageResultsToImageDatas(images)
                    },
                    thumbnail: hasThumbnail ? {
                        create: {
                            cloudinaryPublicId: thumbnail.public_id,
                            cloudinaryAssetId: thumbnail.asset_id,
                            format: thumbnail.format,
                            size: thumbnail.bytes,
                            width: thumbnail.width,
                            height: thumbnail.height,
                            path: thumbnail.secure_url
                        }
                    } : undefined
                }
            });
        },
        delete: async (id) => {
            if (typeof id === 'string') {
                id = Number.parseInt(id);
            }

            return await prisma.album.delete({
                include: {
                    images: true,
                    thumbnail: true
                },
                where: {
                    id
                }
            })
        }
    },
    image: {
        create: () => { },
        delete: () => { }
    }
}
