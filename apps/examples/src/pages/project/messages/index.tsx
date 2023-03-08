// import type { GetServerSideProps } from 'next';
// import type { Message, User } from '@prisma/client';
// import { createProxySSGHelpers } from '@trpc/react-query/ssg';
// import MessagesPage from '../../../components/_pages/messages';
// import { appRouter } from '../../../server/api/root';
// import { createTRPCContext } from '../../../server/api/trpc';

import dynamic from 'next/dynamic';

// export type MessageWithAuthor = Message & { author: User };

// export type MessagePageProps = {
//     data?: MessageWithAuthor[],
//     nextCursor: string | undefined
// };

// export const getServerSideProps: GetServerSideProps<MessagePageProps> = async ({ req, res }) => {
//     // @ts-ignore
//     const ctx = await createTRPCContext({ req, res });
//     // const caller = appRouter.createCaller(ctx);
//     // const messages = await caller.message.getInitial();

//     // const messages = await createProxySSGHelpers({ ctx, router: appRouter }).message.getInitial.fetch();
//     const messages = await createProxySSGHelpers({ ctx, router: appRouter }).message.getInitial.fetch();

//     return {
//         props: {
//             ...messages
//         }
//     };
// };


// const Messages = ({ data, nextCursor }: MessagePageProps) => <MessagesPage data={data} nextCursor={nextCursor} />;

// export default Messages;

export default dynamic(() => import('example-messages/src/pages/messages'));
