import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
    const session = await event.locals.getSession();

    if (!session?.user && event.route.id !== '/bejelentkezes') {
        throw redirect(307, '/bejelentkezes');
    }

    return { session };
};
