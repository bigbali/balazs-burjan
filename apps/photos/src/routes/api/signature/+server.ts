import { sign } from '$lib/server/cloudinary.js';
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
    return json({ ...sign(await request.json()) });
}