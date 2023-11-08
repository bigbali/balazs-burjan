import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const albums = await prisma.album.findMany({
        take: 25,
        include: {
            thumbnail: true,
            images: true
        },
        where: {
            hidden: false
        }
    });

    return {
        albums
    };
};
