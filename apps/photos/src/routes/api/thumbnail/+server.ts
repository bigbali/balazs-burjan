import ServerAPI from '$lib/api/server';
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
    return json(await ServerAPI.Thumbnail.create(await request.json()));
};

export const DELETE = async ({ request }) => {
    return json(await ServerAPI.Thumbnail.delete(await request.json()));
};
