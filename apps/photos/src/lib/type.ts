import type { Prisma } from '@prisma/client';

export type Album = Prisma.AlbumGetPayload<{ include: { images: true, thumbnail: true, archive: true } }>;
export type AlbumWithImages = Prisma.AlbumGetPayload<{ include: { images: true } }>;
export type AlbumWithThumbnail = Prisma.AlbumGetPayload<{ include: { thumbnail: true } }>;
export type AlbumWithArchive = Prisma.AlbumGetPayload<{ include: { archive: true } }>;
export type AlbumOnly = Prisma.AlbumGetPayload<{}>;
export type Image = Prisma.ImageGetPayload<{}>;
export type Thumbnail = Prisma.ThumbnailGetPayload<{}>;
export type Archive = Prisma.ArchiveGetPayload<{}>;
