import { useCallback, useEffect, useRef, useState } from 'react';
import type { MessagePageProps, MessageWithAuthor } from '../../../pages/project/messages';
import { api } from '../../../utils/api';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import Form from './form';
import Message from './message';
import { useSession } from 'next-auth/react';

const MessagesPage = ({ data, nextCursor }: MessagePageProps) => {
    const [messages, setMessages] = useState(data);
    const { status } = useSession();
    const sentinelRef = useRef<HTMLDivElement>(null);
    const [messagesContainerRef] = useAutoAnimate();

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
        const sentinel = new IntersectionObserver(fetchInfiniteQuery, { threshold: 1 });
        sentinel.observe(sentinelRef.current as HTMLElement);

        return () => sentinel.disconnect();
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
                {status === 'authenticated' &&
                    <Form onMessageAdded={handleMessageAdded} />
                }
                {status === 'unauthenticated' &&
                    <>
                        <h2 className='text-2xl text-center'>
                            You&apos;re not logged in.
                        </h2>
                        <p className='text-lg text-center mb-12'>
                            If you decide to log in, you&apos;ll be able to post messages :)
                        </p>
                    </>
                }
                <div className='w-1/2 ml-auto mr-auto' ref={messagesContainerRef}>
                    {messages.map(message => (
                        <Message
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
