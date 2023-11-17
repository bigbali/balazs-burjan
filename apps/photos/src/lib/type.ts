import type { Prisma } from '@prisma/client';
import type { ClientImageCreateParams } from './client/api/image';

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

export type Success<T extends {} = {}> = {
    ok: true,
    message?: string,
    data: T
};

export type Failure = {
    ok: false,
    message?: string,
    reason?: string,
    source: 'client' | 'server'
};

export type ApiResponse<T extends {} = {}> = Success<T> | Failure;

export type CreateAlbumForm = {
    title: string;
    slug: string;
    hidden: boolean;
    description?: string;
    date?: string;
    thumbnail?: FileList;
    images?: FileList;
};

export type CreateImageForm = {
    title?: string;
    description?: string;
    image?: FileList;
};


export type ServerImageCreateParams = Omit<ClientImageCreateParams, 'image' | 'albumPath'> & {
    data: CloudinaryImageResponse,
}

export type Signature = {
    timestamp: string,
    signature: string
}
export type ImageResult = {
    name: string,
    result: ApiResponse<ImageCreatedResponse>
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

export type CloudinaryApiResponse<T> = T | CloudinaryFailure;

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
        thumbnail: ApiResponse<ImageCreatedResponse>,
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

export type CloudinaryFailure = {
    success: false
}

export type FolderDeletedResponse = {
    deleted: string[]
};

export type Tag = 'thumbnail' | 'image';

type SignatureParams = {
    tag: Tag,
    title: string
};
