import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import prisma from '$lib/server/prisma';

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.getSession();

    if (session?.user.role !== 'admin') {
        throw redirect(302, '/');
    }

    const albums = await prisma.album.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            thumbnail: true,
            images: true
        }
    });

    return {
        albums
    };
};
