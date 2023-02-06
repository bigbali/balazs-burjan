import { useCallback, useState } from 'react';
import type { MessagePageProps, MessageWithAuthor } from '../../../pages/project/messages';
import Form from './form';

const MessagesPage = ({ messages }: MessagePageProps) => {
    const [messagesState, setMessagesState] = useState(messages);

    const onMessageAdded = useCallback((data: MessageWithAuthor) => {
        setMessagesState(state => {
            if (!state) return [data];

            return [
                data,
                ...state
            ];
        });
    }, []);

    if (!messagesState) {
        return (
            <h1>
                No messages found bro
            </h1>
        );
    }

    return (
        <div className='pl-24 pr-24 pt-12 pb-12'>
            <Form onMessageAdded={onMessageAdded} />
            <div className='grid grid-cols-3 gap-4'>
                {messagesState.map(message => {
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
                        </article>
                    );
                })}
            </div>
        </div>
    );
};

export default MessagesPage;
