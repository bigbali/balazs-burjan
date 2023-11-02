import type { Prisma } from '@prisma/client';

export type Album = Prisma.AlbumGetPayload<{ include: { images: true, thumbnail: true } }>;
export type Image = Prisma.ImageGetPayload<{}>;