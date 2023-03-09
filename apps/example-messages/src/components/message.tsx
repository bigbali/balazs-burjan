import { useSession } from 'next-auth/react';
import type { Dispatch, SetStateAction } from 'react';
import { useRef, useState } from 'react';
import type { MessageWithAuthor } from '../pages';
import { api } from '../utils/api';

type MessageProps = MessageWithAuthor & { setMessages: Dispatch<SetStateAction<MessageWithAuthor[] | undefined>> };

const Message = ({ setMessages, ...originalMessage }: MessageProps) => {
    const session = useSession();
    const [message, setMessage] = useState(originalMessage);
    const [isEdit, setIsEdit] = useState(false);
    const originalMessageRef = useRef(originalMessage);

    const { mutateAsync: deleteMessage } = api.message.delete.useMutation({
        onSuccess(data, { id }) {
            if (data.deleted) {
                setMessages(state => state?.filter(message => message.id !== id));
            }
        }
    });

    const { mutateAsync: updateMessage } = api.message.update.useMutation({
        onSuccess(data) {
            if (data.content && data.updated_at) {
                setMessage(state => ({
                    ...state,
                    ...data
                }));
            }
        }
    });

    const createdAt = Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(message.created_at);

    const updatedAt = (message.updated_at)
        ? (Intl.DateTimeFormat('en-GB', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(message.updated_at))
        : null;

    const isAuthor = message.user_id === session.data?.user.id;

    return (
        <article key={originalMessage.id} className='border border-slate-400 mb-4 rounded-lg p-2'>
            <div className='flex justify-between'>
                <h1 className='text-xl font-medium'>
                    {message.author.name}
                </h1>
                <div className='flex gap-6'>
                    {updatedAt && (
                        <p className='text-slate-500 text-end text-sm'>
                            edited: {updatedAt}
                        </p>
                    )}
                    <p className='text-slate-600 text-end text-sm'>
                        {createdAt}
                    </p>
                </div>
            </div>
            {isEdit && (
                <textarea
                    onChange={(e) => setMessage(state => ({
                        ...state,
                        content: e.target.value
                    }))}
                    value={message.content}
                    className='resize-none w-full h-32 p-2 rounded-lg focus-visible:outline-1 focus-visible:outline-slate-400'
                />
            )}
            <div className='text-base'>
                {isEdit && (
                    <>
                        <p className='opacity-75 font-medium pl-2 pt-2 pr-2 border-t border-t-slate-300'>
                            Original:
                        </p>
                        <pre className={`
                            text-base leading-normal opacity-75 pl-3 pr-3 pt-1 pb-1
                            break-words whitespace-pre-wrap font-raleway
                        `}
                        >
                            {originalMessageRef.current.content}
                        </pre>
                    </>
                )}
                {!isEdit && (
                    <pre className='text-base leading-normal p-2 break-words whitespace-pre-wrap font-raleway'>
                        {message.content}
                    </pre>
                )}
            </div>
            {isAuthor && (
                <div className='flex gap-2 mt-2'>
                    <button
                        className='text-base font-medium border border-blue rounded-md px-4 py-2 bg-red-700 text-white'
                        onClick={() => void deleteMessage({
                            id: message.id,
                            user_id: session.data?.user.id
                        })}
                    >
                        Delete
                    </button>
                    {!isEdit && (
                        <button
                            className='text-base border border-blue rounded-md px-4 py-2 bg-slate-600 text-white'
                            onClick={() => setIsEdit(true)}
                        >
                            Edit
                        </button>
                    )}
                    {isEdit && (
                        <button
                            className='text-base border border-blue rounded-md px-4 py-2 bg-slate-600 text-white'
                            onClick={() => {
                                setMessage(originalMessageRef.current);
                                setIsEdit(false);
                            }}
                        >
                            Cancel
                        </button>
                    )}
                    {isEdit && (
                        <button
                            className='text-base border border-blue rounded-md px-4 py-2 bg-green-700 text-white'
                            onClick={() => {
                                originalMessageRef.current = message;
                                setIsEdit(false);
                                void updateMessage({
                                    id: message.id,
                                    user_id: session.data?.user.id,
                                    content: message.content
                                });
                            }}
                        >
                            Save
                        </button>
                    )}
                </div>
            )}
        </article>
    );
};

export default Message;
