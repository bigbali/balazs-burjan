import type { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
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

const Header: FC<HeaderProps> = ({ auth }) => {
    const { asPath } = useRouter();

    let session: Session | null = null;
    // Yes, we are breaking the rule of hooks. And it works, so worry not!
    if (auth) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        session = useSession().data;
    }

    return (
        <nav className='flex items-center w-full p-4 gap-4' id='header'>
            <Link href='http://localhost:3000/' className='text-2xl font-medium'>
                Example Projects
            </Link>
            <ul className='flex ml-auto gap-4 capitalize text-lg'>
                {PROJECTS.map(project => {
                    const isCurrent = asPath.slice('/project/'.length) === project;

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
                <div>
                    <p>
                        Hello,&nbsp;
                        <span className='font-medium'>
                            {session.user.name}
                        </span>
                    </p>
                </div>
            )}
        </nav>
    );
};

export default Header;
