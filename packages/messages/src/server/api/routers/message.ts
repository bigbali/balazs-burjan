import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

export const messageRouter = createTRPCRouter({
    getInitial: publicProcedure.query(async ({ ctx }) => {
        const query = await ctx.prisma.message.findMany({
            take: 21,
            include: {
                author: true
            },
            orderBy: {
                created_at: Prisma.SortOrder.desc
            }
        });

        const cursor = query.pop()?.id;

        return {
            data: query,
            nextCursor: cursor
        };
    }),
    infiniteMessages: publicProcedure
        .input(z.object({
            limit: z.number().min(1).max(100).nullish(),
            cursor: z.string().nullish()
        }))
        .query(async ({ ctx, input }) => {
            const limit = input.limit ?? 20;
            const { cursor } = input;
            const items = await ctx.prisma.message.findMany({
                take: limit + 1, // get an extra item at the end which we'll use as next cursor
                include: {
                    author: true
                },
                cursor: cursor ? { id: cursor } : undefined,
                orderBy: {
                    created_at: Prisma.SortOrder.desc
                }
            });

            let nextCursor: typeof cursor | undefined = undefined;
            if (items.length > limit) {
                const nextItem = items.pop();
                nextCursor = nextItem ? nextItem.id : undefined;
            }

            return {
                items,
                nextCursor
            };
        }),
    add: protectedProcedure
        .input(z.object({ content: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const message = await ctx.prisma.message.create({
                data: {
                    content: input.content,
                    author: {
                        connect: {
                            id: ctx.session.user.id
                        }
                    }
                },
                include: {
                    author: true
                }
            });

            return message;
        }),
    delete: protectedProcedure
        .input(z.object({
            id: z.string(),
            user_id: z.string().nullish()
        }))
        .mutation(async ({ ctx, input }) => {
            if (input.user_id === ctx.session.user.id) {
                await ctx.prisma.message.delete({
                    where: {
                        id: input.id
                    }
                });

                return {
                    deleted: true
                };
            }

            return {
                deleted: false
            };
        }),
    update: protectedProcedure
        .input(z.object({
            id: z.string(),
            user_id: z.string().nullish(),
            content: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            const data = {
                content: input.content,
                updated_at: new Date()
            };

            if (input.user_id === ctx.session.user.id) {
                await ctx.prisma.message.update({
                    where: {
                        id: input.id
                    },
                    data
                });

                return data;
            }

            return {
                content: null,
                updated_at: null
            };
        })
});
