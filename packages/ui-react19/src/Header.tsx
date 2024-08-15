import type { Session } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';

const PROJECTS = [
    {
        path: 'algorithms',
        devPath: 'localhost:3001/algorithms/',
        name: 'Algorithms',
        disabled: false
    },
    { path: 'messages', name: 'Messages', disabled: true },
    { path: 'drawing', name: 'Drawing', disabled: true },
    { path: 'solar-system', name: 'Solar System Simulation (WASM)', disabled: true }
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
        session = useSession().data;
    }

    return (
        <nav className='flex items-center w-full gap-4 p-2 border-b' id='header'>
            <ul className='flex gap-4 mx-auto capitalize'>
                {PROJECTS.map(project => {
                    const isCurrent = path.includes(project.path);

                    if (project.disabled) {
                        return (
                            <li
                                key={project.path}
                                className='cursor-not-allowed text-muted-foreground'
                                title='Currently not available.'
                            >
                                {project.name}
                            </li>
                        );
                    }

                    return (
                        <li key={project.path}>
                            <Link
                                href={
                                    process.env.NODE_ENV === 'development'
                                        ? project.devPath // we need to escape per-project asPath, thus we use absolute path
                                        : `https://projects.balazsburjan.com/${project.path}`
                                }
                                className={`hover:text-primary ${isCurrent ? 'border-b-2 border-primary' : ''}`}
                            >
                                {project.name}
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
