import type { ApiResponse, CloudinaryUploadResponse } from '..';
import type { ImageResult } from '../image';
import type { Thumb } from '../thumbnail';

export type AlbumCreateForm = {
    title: string,
    slug: string,
    hidden: boolean,
    description?: string,
    date?: string,
    thumbnail?: FileList,
    images?: FileList,
};

export type AlbumEditForm = {
    title?: string;
    slug?: string;
    hidden?: boolean;
    description?: string;
    date?: string;
    thumbnail?: FileList;
};

export type AlbumCreateParams = {
    form: AlbumCreateForm,
    images: ImageResult[],
    thumbnail: ApiResponse<CloudinaryUploadResponse>,
    folder: string
};

export type AlbumEditParams<T extends 'client' | 'server', TThumb = Thumb<T>> = {
    id: T extends 'client' ? number : string,
    title?: string,
    slug?: string,
    description?: string,
    date?: string,
    hidden?: T extends 'client' ? boolean : string,
    thumbnail?: TThumb
} & (T extends 'client' ? { originalTitle: string } : {});

export type AlbumGenerateArchiveParams<T extends 'client' | 'server' = 'client'> = {
    id: T extends 'client' ? number : string
};

