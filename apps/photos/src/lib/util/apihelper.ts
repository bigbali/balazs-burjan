export const pretty = (obj: any) => typeof obj === 'string'
    ? obj
    : JSON.stringify(obj, null, 2);

export const ok = <T extends {}>(params: { message?: string, data: T }): Success<T> => {
    return {
        ok: true,
        ...params
    }
}

export const okish = <T extends {}, W extends unknown[]>(params: { message?: string, data: T, warnings: W }): Success<T> & { warnings: W } => {
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

/** Since the Cloudinary error object is an utter retardation, we collect it here so we don't go mad.\
 * Note: don't await the `actions` when passing them in as args.
 */
export const collectCloudinary = async (actions: Promise<unknown>[], collector: CloudinaryErrorContainer['error'][]) => {
    const results = [];

    for (const action of actions) {
        try {
            const result = await action;
            results.push(result);
        } catch (error) {
            collector.push((error as CloudinaryErrorContainer).error);
        }
    }

    return results;
}

import { dev } from "$app/environment";
import type { CloudinaryErrorContainer, Failure, Success } from "$lib/api";
export const log = (params: any, ...rest: any[]) => {
    if (dev) {
        console.log(params, ...rest);
    }
}


import { writable } from 'svelte/store';
export const transition = (init = false) => {
    const store = writable(init);

    const suspend = async (when: Promise<any>) => {
        store.set(true);
        await when;
        store.set(false);

        return (e: any) => { };
    }

    return [store, suspend] as const;
}

export const requestBody = <T>(payload: T) => {
    return JSON.stringify(payload);
}

type ApiRoute = 'album' | 'image' | 'thumbnail';
type ApiMethod = 'POST' | 'PATCH' | 'DELETE';

export const FETCH = async <Return, Body>(route: ApiRoute, method: ApiMethod, body: Body): Promise<Return> => {
    const response = await fetch(`/api/${route}`, {
        method,
        body: requestBody<Body>(body)
    });

    return await response.json() as Return;
}

export const POST = async <Return, Body = any>(route: ApiRoute, body: Body) => await FETCH<Return, Body>(route, 'POST', body);
export const PATCH = async <Return, Body = any>(route: ApiRoute, body: Body) => await FETCH<Return, Body>(route, 'PATCH', body);
export const DELETE = async <Return, Body = any>(route: ApiRoute, body: Body) => await FETCH<Return, Body>(route, 'DELETE', body);