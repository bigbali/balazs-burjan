import type { ApiResponse, CloudinaryUploadResponse } from ".."

export type ThumbnailCreateParams<T extends 'client' | 'server' = 'client'> = {
    album: T extends 'client'
    ? { title: string }
    : { id: string },
    thumbnail: T extends 'client'
    ? { file: File }
    : { data: CloudinaryUploadResponse }
}

export type ThumbnailEditParams<T extends 'client' | 'server' = 'client'> = {
    album: T extends 'client'
    ? { title: string }
    : { id: string },
    thumbnail: T extends 'client'
    ? { file: File }
    : { data: CloudinaryUploadResponse }
}

export type ThumbnailDeleteParams<T extends 'client' | 'server' = 'client'> =
    T extends 'client'
    ? { id: number }
    : { id: string }

type ThumbnailEditClient = FileList;
type ThumbnailEditServer = ApiResponse<CloudinaryUploadResponse>;

export type Thumb<T> = T extends 'client' ? ThumbnailEditClient : ThumbnailEditServer;

