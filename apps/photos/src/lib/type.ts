import type { Album, Thumbnail } from '@prisma/client';

export type AlbumWithThumbnail = Album & { thumbnail: Thumbnail | null };