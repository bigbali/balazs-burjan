import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.getSession();

    if (session?.user) {
        throw redirect(307, '/');
    }

    return { session };
};