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

export type CloudinaryError = {
    message: string,
    http_code: number
}

export type CloudinaryErrorContainer = {
    error: CloudinaryError
};

export type Tag = 'thumbnail' | 'image';
