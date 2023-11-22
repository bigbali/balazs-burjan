import type { Prisma } from '@prisma/client';

export type Album = Prisma.AlbumGetPayload<{ include: { images: true, thumbnail: true } }>;
export type AlbumOnly = Prisma.AlbumGetPayload<{}>;
export type AlbumWithImages = Prisma.AlbumGetPayload<{ include: { images: true } }>;
export type AlbumWithThumbnail = Prisma.AlbumGetPayload<{ include: { thumbnail: true } }>;
export type Image = Prisma.ImageGetPayload<{}>;
export type Thumbnail = Prisma.ThumbnailGetPayload<{}>;

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

export type CloudinaryUploadResponse = {
    public_id: string,
    asset_id: string,
    secure_url: string,
    folder: string,
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
    error?: unknown,
    source: 'client' | 'server'
};

export type ApiResponse<T extends {} = {}> = Success<T> | Failure;

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


export type Signature = {
    timestamp: string,
    signature: string
}
export type ImageResult = {
    name: string,
    result: ApiResponse<CloudinaryUploadResponse>
}

export type ImageDeletedResponse = {
    deleted: Record<string, string>,
    partial: boolean
}

export type ActionResponse = ActionSuccess | ActionFailure;

export type ApiData = CreateAlbumData | DeleteAlbumData;

export type CloudinaryApiResponse<T> = T | CloudinaryFailure;

export type CloudinaryError = {
    message: string,
    http_code: number
}

export type CloudinaryErrorContainer = {
    error: CloudinaryError
};

// todo remove
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
        form: AlbumCreateForm,
        images: ImageResult[],
        thumbnail: ApiResponse<CloudinaryUploadResponse>,
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

type ThumbnailEditClient = FileList;
type ThumbnailEditServer = ApiResponse<CloudinaryUploadResponse>;

type Thumb<T> = T extends 'client' ? ThumbnailEditClient : ThumbnailEditServer;

export type AlbumEditParams<T extends 'client' | 'server', TThumb = Thumb<T>> = {
    id: T extends 'client' ? number : string,
    title?: string,
    slug?: string,
    description?: string,
    date?: string,
    hidden?: T extends 'client' ? boolean : string,
    thumbnail?: TThumb
} & (T extends 'client' ? { originalTitle: string } : {})
