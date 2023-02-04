import type { Message } from '@prisma/client';
import MessagesPage from '../../../components/_pages/messages';
import { appRouter } from '../../../server/api/root';
import { prisma } from '../../../server/db';

// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticProps = async () => {
    // const messages = await prisma.message.findMany({ take: 20 });
    // console.log(messages);

    // const messages = await appRouter.message.createCaller()

    return {
        props: {
            messages: []
        }
    };
};

export type MessagePageProps = {
    messages?: Message[]
};

const Messages = ({ messages }: MessagePageProps) => <MessagesPage messages={messages} />;

export default Messages;
