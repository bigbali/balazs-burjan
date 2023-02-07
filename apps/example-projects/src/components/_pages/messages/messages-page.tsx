import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { MessagePageProps, MessageWithAuthor } from '../../../pages/project/messages';
import { api } from '../../../utils/api';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import Form from './form';

const MessagesPage = ({ data, nextCursor }: MessagePageProps) => {
    const [messages, setMessages] = useState(data);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const [messagesContainerRef] = useAutoAnimate();
    const session = useSession();

    const { mutateAsync: deleteMessage } = api.message.delete.useMutation({
        onSuccess(data, { id }) {
            if (data.deleted) {
                setMessages(state => state?.filter(message => message.id !== id));
            }
        }
    });

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
                <p className='text-xl mb-4'>
                    Here you can leave messages.
                </p>
                <Form onMessageAdded={handleMessageAdded} />
                <div className='grid grid-cols-3 gap-4' ref={messagesContainerRef}>
                    {messages.map(message => {
                        const createdAt = Intl.DateTimeFormat('en-GB', {
                            year: 'numeric',
                            month: 'long',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        }).format(message.created_at);

                        return (
                            <article key={message.id} className='border border-red-400 mb-4'>
                                <h1 className='text-xl font-medium'>
                                    {message.author.name}
                                </h1>
                                <p className='text-base'>
                                    {message.content}
                                </p>
                                <p>
                                    {createdAt}
                                </p>
                                {message.user_id === session.data?.user.id && (
                                    <button
                                        className='text-xl border border-blue rounded-full p-4 bg-cyan-800 text-white'
                                        onClick={() => void deleteMessage({ id: message.id, user_id: session.data?.user.id })}
                                    >
                                        Delete
                                    </button>
                                )}
                            </article>
                        );
                    })}
                </div>
                <div className='sentinel' ref={sentinelRef} />
            </div>
        </div>
    );
};

export default MessagesPage;
