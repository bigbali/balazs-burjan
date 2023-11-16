import { dev } from "$app/environment";
import type { Failure, Success } from "./type";

export const pretty = (obj: any) => JSON.stringify(obj, null, 2);

export const ok = <T extends {}>(params: { message?: string, data: T }): Success<T> => {
    return {
        ok: true,
        ...params
    }
}

export const failure = (params: Omit<Failure, 'ok'>): Failure => {
    return {
        ok: false,
        ...params
    }
}

export const unwrap = (error: unknown): string => {
    if (typeof error === 'string') {
        return error;
    }

    return (error as Error).message;
}

export const log = (params: any) => {
    if (dev) {
        console.log(params);
    }
}