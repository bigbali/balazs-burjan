import {
    type FormEvent,
    useState
} from 'react';
import type { MessageWithAuthor } from './message';
import { api } from '../utils/api';

export type FormProps = {
    onMessageAdded: (data: MessageWithAuthor) => void
};

const Form = ({ onMessageAdded }: FormProps) => {
    const [message, setMessage] = useState('');

    const addMessage = api.message.add.useMutation({
        onSuccess: onMessageAdded
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setMessage('');
        void addMessage.mutateAsync({ content: message });
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col items-center gap-4 mb-16'>
            <div className='w-1/3'>
                <h2 className='text-xl mb-2'>
                    Leave me a message:
                </h2>
                <textarea
                    value={message}
                    onChange={e => setMessage(e.currentTarget.value)}
                    className={`
                        border border-slate-400 rounded-lg w-full h-60
                        resize-none p-2 focus-visible:border-slate-700 focus-visible:outline-none
                    `}
                />
                <input
                    type='submit'
                    value='Submit'
                    disabled={message.replace(/\s/g, '').length === 0}
                    className={`
                        border border-teal-900 bg-teal-800 rounded-lg p-2 pl-6 pr-6 text-xl
                        text-white font-medium self-start hover:bg-teal-900 cursor-pointer
                        disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                />
            </div>
        </form>
    );
};

export default Form;
