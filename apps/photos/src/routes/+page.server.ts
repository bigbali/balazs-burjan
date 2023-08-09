import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const albums = await prisma.album.findMany({
        take: 25,
        include: {
            thumbnail: true
        }
    });

    return {
        albums
    };
};
