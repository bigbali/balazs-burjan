import type { ImageCreatedResponse, ImageResult, ImageData } from "$lib/type";

export const convertImageResults = (images: ImageResult[]): ImageData[] => {
    return images.map(image => {
        if (!image.result?.ok) return null;

        return formatImageResponse(image.result.data);
    }).filter((image) => image !== null) as ImageData[]
}

export const formatImageResponse = (image: ImageCreatedResponse) => ({
    path: image.secure_url,
    cloudinaryPublicId: image.public_id,
    cloudinaryAssetId: image.asset_id,
    size: image.bytes,
    format: image.format,
    width: image.width,
    height: image.height
});
