import type { MessagePageProps } from '../../../pages/project/messages';

const MessagesPage = ({ messages }: MessagePageProps) => {
    if (!messages) {
        return (
            <h1>
                No messages found bro
            </h1>
        );
    }
    return (
        <>
            {messages.map(message => (
                <article key={message.id} className='border border-red-400 mb-4'>
                    <h1 className='text-xl font-medium'>
                        {message.author.name}
                    </h1>
                    <p className='text-base'>
                        {message.content}
                    </p>
                </article>
            ))}
        </>
    );
};

export default MessagesPage;
