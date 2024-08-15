import type { Session } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';

const PROJECTS = [
    'algorithms',
    'messages'
] as const;

type HeaderProps = {
    auth: boolean
};

// TODO this should not be in a general component lib, ya?

const Header: FC<HeaderProps> = ({ auth }) => {
    const { basePath, asPath } = useRouter();
    const path = basePath || asPath;

    let session: Session | null = null;
    // as 'auth' is absolutely static, we can use it to conditionally call the hook
    // (although the linter will still bare its teeth for it)
    if (auth) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        session = useSession().data;
    }

    return (
        <nav className='flex items-center w-full gap-4 p-4' id='header'>
            <Link href='http://localhost:3000/' className='text-2xl font-medium'>
                Example Projects
            </Link>
            <ul className='flex gap-4 ml-auto text-lg capitalize'>
                {PROJECTS.map(project => {
                    const isCurrent = path.slice('/project/'.length) === project;

                    return (
                        <li key={project}>
                            <Link
                                href={`http://localhost:3000/project/${project}`}
                                className={`hover:text-theme-red ${isCurrent ? 'text-theme-red' : ''}`}>
                                {project}
                            </Link>
                        </li>
                    );
                })}
            </ul>
            {session?.user && (
                <div className='flex items-center gap-4'>
                    <p>
                        Hello,&nbsp;
                        <span className='font-medium'>
                            {session.user.name}
                        </span>
                    </p>
                    <button className='px-4 py-2 font-medium border rounded-2 border-theme-red' onClick={() => void signOut()}>
                        Sign out
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Header;
