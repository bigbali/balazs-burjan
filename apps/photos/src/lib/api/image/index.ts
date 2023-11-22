import type { ImageResult, ImageData, CloudinaryUploadResponse } from "$lib/type";

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
