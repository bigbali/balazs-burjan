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

export type CloudinaryUploadResponse<T extends 'image' | 'archive' = 'image'> = T extends 'image' ? {
    public_id: string,
    asset_id: string,
    secure_url: string,
    folder: string,
    width: number,
    height: number,
    format: string,
    bytes: number
} : { secure_url: string, public_id: string };

export type CloudinaryError = {
    message: string,
    http_code: number
};

export type CloudinaryErrorContainer = {
    error: CloudinaryError
};

export type Tag = 'thumbnail' | 'image';
