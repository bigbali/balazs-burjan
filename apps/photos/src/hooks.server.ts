import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/core/providers/google';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { sequence } from '@sveltejs/kit/hooks';

async function authorization({ event, resolve }) {
    // Protect any routes under /authenticated
    if (event.url.pathname.startsWith('/vedett')) {
        const session = await event.locals.getSession();
        if (!session) {
            throw redirect(303, '/bejelentkezes');
        }
    }

    return resolve(event);
}

export const handle = sequence(SvelteKitAuth({
    providers: [
        Google({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            clientId: GOOGLE_CLIENT_ID,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            clientSecret: GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code'
                }
            }
        })
    ],
    secret: process.env.AUTH_SECRET,
    trustHost: true
}), authorization);