import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load = async ({ params }) => {
    const album = await prisma.album.findFirst({
        where: {
            slug: {
                equals: params.album
            }
        },
        include: {
            images: true
        }
    });

    return {
        album
    };
};