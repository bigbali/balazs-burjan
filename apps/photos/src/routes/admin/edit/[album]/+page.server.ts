import prisma from '$lib/server/prisma';
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
            images: {
                orderBy: {
                    createdAt: 'desc'
                }
            },
            thumbnail: true,
            archive: true
        }
    });

    return {
        album
    };
};
