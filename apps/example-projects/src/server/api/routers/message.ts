import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

export const messageRouter = createTRPCRouter({
    getInitial: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.message.findMany({
            take: 20,
            include: {
                author: true
            },
            orderBy: {
                created_at: Prisma.SortOrder.desc
            }
        });
    }),
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.message.findMany({
            include: {
                author: true
            },
            orderBy: {
                created_at: Prisma.SortOrder.desc
            }
        });
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
        })
});
