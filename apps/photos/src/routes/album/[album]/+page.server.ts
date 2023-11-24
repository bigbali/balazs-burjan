import prisma from '$lib/server/prisma';

export const load = async ({ params }) => {
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
            archive: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return {
        album
    };
};