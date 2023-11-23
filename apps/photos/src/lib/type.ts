import type { Prisma } from '@prisma/client';

export type Album = Prisma.AlbumGetPayload<{ include: { images: true, thumbnail: true } }>;
export type AlbumOnly = Prisma.AlbumGetPayload<{}>;
export type AlbumWithImages = Prisma.AlbumGetPayload<{ include: { images: true } }>;
export type AlbumWithThumbnail = Prisma.AlbumGetPayload<{ include: { thumbnail: true } }>;
export type Image = Prisma.ImageGetPayload<{}>;
export type Thumbnail = Prisma.ThumbnailGetPayload<{}>;


// export type CloudinaryFolderResponse = {
//     success: boolean,
//     path: string,
// }

// export type ActionSuccess<T extends {} = {}> = {
//     ok: true,
//     message?: string,
//     signature: string,
//     data: T
// };

// export type ActionFailure = {
//     ok: false,
//     message?: string
// }



// export type ImageDeletedResponse = {
//     deleted: Record<string, string>,
//     partial: boolean
// }

// export type ActionResponse = ActionSuccess | ActionFailure;

// export type CloudinaryApiResponse<T> = T | CloudinaryFailure;

// export type CloudinaryError = {
//     message: string,
//     http_code: number
// }

// export type CloudinaryErrorContainer = {
//     error: CloudinaryError
// };

// export type CloudinaryFailure = {
//     success: false
// }

// export type FolderDeletedResponse = {
//     deleted: string[]
// };


// type ThumbnailEditClient = FileList;
// type ThumbnailEditServer = ApiResponse<CloudinaryUploadResponse>;

// type Thumb<T> = T extends 'client' ? ThumbnailEditClient : ThumbnailEditServer;

