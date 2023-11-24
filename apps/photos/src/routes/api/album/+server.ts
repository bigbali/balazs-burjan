import ServerAPI from '$lib/api/server';
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
    return json(await ServerAPI.Album.create(await request.json()));
};

export const PATCH = async ({ request }) => {
    return json(await ServerAPI.Album.edit(await request.json()));
};

export const DELETE = async ({ request }) => {
    return json(await ServerAPI.Album.delete(await request.json()));
};
