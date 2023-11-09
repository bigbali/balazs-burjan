import type { Prisma } from '@prisma/client';

export type Album = Prisma.AlbumGetPayload<{ include: { images: true, thumbnail: true } }>;
export type AlbumOnly = Prisma.AlbumGetPayload<{}>;
export type AlbumWithImages = Prisma.AlbumGetPayload<{ include: { images: true } }>;
export type AlbumWithThumbnail = Prisma.AlbumGetPayload<{ include: { thumbnail: true } }>;
export type Image = Prisma.ImageGetPayload<{}>;

export type ImageData = {
    path: string,
    cloudinaryAssetId: string,
    cloudinaryPublicId: string,
    width: number,
    height: number,
    format: string,
    size: number
};

export type CloudinaryImageResponse = {
    secure_url: string,
    asset_id: string,
    public_id: string,
    width: number,
    height: number,
    format: string,
    bytes: number
};

