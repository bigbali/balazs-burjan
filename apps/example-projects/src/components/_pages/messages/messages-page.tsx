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
        <ul>
            {messages.map(message => (
                <li key={message.id}>
                    {message.content}
                </li>
            ))}
        </ul>
    );
};

export default MessagesPage;
