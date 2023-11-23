import type { ApiResponse, CloudinaryUploadResponse } from "..";

export type ImageData = {
    cloudinaryPublicId: string,
    cloudinaryAssetId: string,
    source: string,
    folder: string,
    width: number,
    height: number,
    format: string,
    size: number
};

export type ImageResult = {
    name: string,
    result: ApiResponse<CloudinaryUploadResponse>
}

export type ImageCreateForm = {
    title?: string;
    description?: string;
    image?: FileList;
};

export type ImageInitializeParams = {
    album: { title: string } | { folder: string },
    image: {
        file: File
    }
}

export type ImageCreateParams<T extends 'client' | 'server' = 'client'> = {
    album: T extends 'client'
    ? { id: number, path: string }
    : { id: string }
    image: {
        title?: string,
        description?: string
    } & (T extends 'client'
        ? { file: File }
        : { data: CloudinaryUploadResponse })
}

export type ImageEditParams<T extends 'client' | 'server' = 'client'> = {
    id: T extends 'client' ? number : string,
    title?: string,
    description?: string
}

export type ImageDeleteParams<T extends 'client' | 'server' = 'client'> = {
    id: T extends 'client' ? number : string,
}

export const convertImageResults = (images: ImageResult[]): ImageData[] => {
    return images.map(image => {
        if (!image.result?.ok) return null;

        return formatImageResponse(image.result.data);
    }).filter((image) => image !== null) as ImageData[]
}

export const formatImageResponse = (image: CloudinaryUploadResponse) => ({
    cloudinaryAssetId: image.asset_id,
    cloudinaryPublicId: image.public_id,
    source: image.secure_url,
    folder: image.folder,
    size: image.bytes,
    format: image.format,
    width: image.width,
    height: image.height
});
