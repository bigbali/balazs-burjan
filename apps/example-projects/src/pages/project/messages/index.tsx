import type { GetServerSideProps } from 'next';
import type { Message, User } from '@prisma/client';
import { createServerSideHelpers } from '@trpc/react-query/server';
import MessagesPage from '../../../components/_pages/messages';
import { appRouter } from '../../../server/api/root';
import { createTRPCContext } from '../../../server/api/trpc';

export type MessageWithAuthor = Message & { author: User };

export type MessagePageProps = {
    data?: MessageWithAuthor[],
    nextCursor: string | undefined
};

export const getServerSideProps: GetServerSideProps<MessagePageProps> = async ({ req, res }) => {
    // @ts-ignore FIXME
    const ctx = await createTRPCContext({ req, res });
    const messages = await createServerSideHelpers({ ctx, router: appRouter }).message.getInitial.fetch();

    return {
        props: {
            ...messages
        }
    };
};

const Messages = ({ data, nextCursor }: MessagePageProps) => <MessagesPage data={data} nextCursor={nextCursor} />;

export default Messages;
