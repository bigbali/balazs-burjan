import ServerAPI from '$lib/api/server';
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
    return json(await ServerAPI.Image.create(await request.json()));
};

export const PATCH = async ({ request }) => {
    return json(await ServerAPI.Image.edit(await request.json()));
};

export const DELETE = async ({ request }) => {
    return json(await ServerAPI.Image.delete(await request.json()));
};
