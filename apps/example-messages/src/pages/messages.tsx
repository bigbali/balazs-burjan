import { useCallback, useEffect, useRef, useState } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import type { User, Message } from '@prisma/client';
import { PrismaClient, Prisma } from '@prisma/client';
import { default as MessageComponent } from '../components/message';
import Form from '../components/form';
import { api } from '../utils/api';
import type { GetServerSideProps } from 'next';
import { createTRPCContext } from '../server/api/trpc';
import { appRouter } from '../server/api/root';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';


export type MessageWithAuthor = Message & { author: User };

export type MessagePageProps = {
    data?: MessageWithAuthor[],
    nextCursor: string | undefined
};

export const getServerSideProps: GetServerSideProps<MessagePageProps> = async ({ req, res }) => {
    // @ts-ignore
    // const ctx = await createTRPCContext({ req, res });
    // // const caller = appRouter.createCaller(ctx);
    // // const messages = await caller.message.getInitial();

    // // const messages = await createProxySSGHelpers({ ctx, router: appRouter }).message.getInitial.fetch();
    // const messages = await createProxySSGHelpers({ ctx, router: appRouter }).message.getInitial.fetch();

    // api.message.getInitial.useQuery();

    const prisma = new PrismaClient();
    const messages = await prisma.message.findMany({
        take: 21,
        include: {
            author: true
        },
        orderBy: {
            created_at: Prisma.SortOrder.desc
        }
    });

    return {
        props: {
            nextCursor: messages.pop()?.id,
            data: [...messages]
        }
    };
};

const MessagesPage = ({ data, nextCursor }: MessagePageProps) => {
    const [messages, setMessages] = useState(data);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const [messagesContainerRef] = useAutoAnimate();


    // if (process && process.env) {
    //     console.log(process.cwd(), JSON.stringify(process.env, undefined, 4));
    // }

    console.log(api);

    const { fetchNextPage, hasNextPage } = api.message.infiniteMessages.useInfiniteQuery({}, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        onSuccess(data) {
            setMessages(                              // If `items` is undefined, return empty array that will be stripped
                data.pages.flatMap(page => page.items || [])
            );
        },
        initialData: {
            pages: [
                {
                    items: data,
                    nextCursor: nextCursor
                }
            ],
            pageParams: [nextCursor]
        },
        enabled: false
    });

    const fetchInfiniteQuery = useCallback<IntersectionObserverCallback>((e) => {
        e.forEach(element => {
            if (element.isIntersecting) {
                if (hasNextPage) {
                    void fetchNextPage();
                }
            }
        });
    }, [fetchNextPage, hasNextPage]);

    const handleMessageAdded = useCallback((data: MessageWithAuthor) => {
        setMessages(state => {
            if (!state) return [data];

            return [
                data,
                ...state
            ];
        });
    }, []);

    useEffect(() => {
        if (sentinelRef.current) {
            const sentinel = new IntersectionObserver(fetchInfiniteQuery, { threshold: 1 });
            sentinel.observe(sentinelRef.current as HTMLElement);

            return () => sentinel.disconnect();
        }
    }, [fetchInfiniteQuery]);


    if (!messages) {
        return (
            <h1>
                No messages found bro
            </h1>
        );
    }

    return (
        <div className='pl-24 pr-24 pt-12 pb-12'>
            <h1 className='text-3xl font-medium text-center mb-8'>
                Messages
            </h1>
            <div>
                <Form onMessageAdded={handleMessageAdded} />
                <div className='w-1/2 ml-auto mr-auto' ref={messagesContainerRef}>
                    {messages.map(message => (
                        <MessageComponent
                            key={message.id}
                            setMessages={setMessages}
                            {...message} />
                    ))}
                </div>
                <div className='sentinel' ref={sentinelRef} />
            </div>
        </div>
    );
};

export default MessagesPage;
