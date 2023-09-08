import prisma from '$lib/prisma';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
    const session = await locals.getSession();

    if (session?.user.role !== 'admin') {
        throw redirect(302, '/');
    }

    const album = await prisma.album.findFirst({
        where: {
            slug: {
                equals: params.album
            }
        },
        include: {
            images: true,
            thumbnail: true
        }
    });

    return {
        album
    };
};