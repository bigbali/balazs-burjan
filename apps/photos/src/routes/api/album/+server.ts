import ServerAPI from '$lib/api/server';
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
    const body = await request.json();

    if ('generateArchive' in body) {
        return json(await ServerAPI.Album.generateArchive(body));
    }

    return json(await ServerAPI.Album.create(body));
};

export const PATCH = async ({ request }) => {
    return json(await ServerAPI.Album.edit(await request.json()));
};

export const DELETE = async ({ request }) => {
    return json(await ServerAPI.Album.delete(await request.json()));
};
