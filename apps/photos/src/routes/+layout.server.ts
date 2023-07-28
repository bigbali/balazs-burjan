import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
    const session = await event.locals.getSession();

    if (!session?.user && event.route.id !== '/bejelentkezes') {
        throw redirect(307, '/bejelentkezes');
    }

    return { session };
};
