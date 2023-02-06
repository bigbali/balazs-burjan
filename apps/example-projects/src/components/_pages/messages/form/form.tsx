import { type FormEvent, useState } from 'react';
import { api } from '../../../../utils/api';
import type { MessageWithAuthor } from '../../../../pages/project/messages';

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
        void addMessage.mutateAsync({ content: message });
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                name=''
                id=''
                cols={30}
                rows={10}
                value={message}
                onChange={e => setMessage(e.currentTarget.value)}
                className='border border-emerald-700' />
            <input type='submit' value='Submit' className='border border-blue-700' />
        </form>
    );
};

export default Form;
