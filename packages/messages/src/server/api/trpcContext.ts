import type { Session } from 'next-auth';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { prisma } from '../db';
import { getServerAuthSession } from '../auth';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from './root';
import SuperJSON from 'superjson';

// NOTE: this needed to be moved from `trpc.ts` because there was a circular reference issue.

type CreateContextOptions = {
    session: Session | null;
};

/**
 * This helper generates the "internals" for a tRPC context. If you need to use
 * it, you can export it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
export const createInnerTRPCContext = (opts: CreateContextOptions) => {
    return {
        session: opts.session,
        prisma
    };
};

/**
 * This is the actual context you will use in your router. It will be used to
 * process every request that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
    const { req, res } = opts;

    // Get the session from the server using the getServerSession wrapper function
    const session = await getServerAuthSession({ req, res });

    return createInnerTRPCContext({
        session
    });
};

/**
 * Use this during SSG or SSR when you don't need authentication.
 */
export const ssgPublic = createServerSideHelpers({
    router: appRouter,
    ctx: {
        session: null,
        prisma
    },
    transformer: SuperJSON // optional - adds superjson serialization
});

