import prisma from '$lib/prisma';

export const load = async ({ params }) => {
    // if((await locals.getSession())?.user)

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