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

export type CloudinaryFolderResponse = {
    success: boolean,
    path: string,
}

export type ActionSuccess<T extends {} = {}> = {
    ok: true,
    message?: string,
    signature: string,
    data: T
};

export type ActionFailure = {
    ok: false,
    message?: string
}

export type CloudinarySuccess<T extends {} = {}> = {
    ok: true,
    message?: string,
    data: T
};

export type CloudinaryFailure = {
    ok: false,
    message?: string
};

export type CloudinaryApiResponse<T extends {} = {}> = CloudinarySuccess<T> | CloudinaryFailure;

export type CreateAlbumForm = {
    title: string;
    slug: string;
    hidden: boolean;
    description?: string;
    date?: string;
    thumbnail?: FileList;
    images?: FileList;
};

export type Signature = {
    timestamp: string,
    signature: string
}
export type ImageResult = {
    name: string,
    result: ImageCreatedResponse | Failure
}
export type ImageCreatedResponse = {
    secure_url: string,
    asset_id: string,
    public_id: string,
    width: number,
    height: number,
    format: string,
    bytes: number
};

export type ImageDeletedResponse = {
    deleted: Record<string, string>,
    partial: boolean
}


export type ActionResponse = ActionSuccess | ActionFailure;

export type ApiData = CreateAlbumData | DeleteAlbumData;

export type ApiResponse<T> = T | Failure;

export const enum DbActionType {
    CREATE_ALBUM,
    DELETE_ALBUM,
    UPDATE_ALBUM,
    CREATE_IMAGE,
    DELETE_IMAGE
}

export type CreateAlbumData = {
    type: DbActionType.CREATE_ALBUM,
    data: {
        form: CreateAlbumForm,
        images: ImageResult[],
        thumbnail: ImageCreatedResponse | Failure | null,
        folder: string
    }
}

export type DeleteAlbumData = {
    type: DbActionType.DELETE_ALBUM,
    data: {
        form: {
            id: string
        }
    }
}

export type Failure = {
    success: false
}

export type FolderCreatedResponse = {
    success: true,
    path: string,
    name: string
};

export type FolderDeletedResponse = {
    success: true,
};



export type Tag = 'thumbnail' | 'image';

type SignatureParams = {
    tag: Tag,
    title: string
};
