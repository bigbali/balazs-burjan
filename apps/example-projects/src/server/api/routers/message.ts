import { createTRPCRouter, publicProcedure } from '../trpc';

export const messageRouter = createTRPCRouter({
    getInitial: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.message.findMany({
            take: 20,
            include: {
                author: true
            }
        });
    }),
});
