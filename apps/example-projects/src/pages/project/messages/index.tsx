import type { GetServerSideProps } from 'next';
import type { Message, User } from '@prisma/client';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import MessagesPage from '../../../components/_pages/messages';
import { appRouter } from '../../../server/api/root';
import { createTRPCContext } from '../../../server/api/trpc';

export type MessageWithAuthor = Message & { author: User };

export type MessagePageProps = {
    messages?: MessageWithAuthor[]
};

export const getServerSideProps: GetServerSideProps<MessagePageProps> = async ({ req, res }) => {
    // @ts-ignore
    const ctx = await createTRPCContext({ req, res });
    // const caller = appRouter.createCaller(ctx);
    // const messages = await caller.message.getInitial();

    // const messages = await createProxySSGHelpers({ ctx, router: appRouter }).message.getInitial.fetch();
    const messages = await createProxySSGHelpers({ ctx, router: appRouter }).message.getAll.fetch();

    return {
        props: {
            messages
        }
    };
};


const Messages = ({ messages }: MessagePageProps) => <MessagesPage messages={messages} />;

export default Messages;
