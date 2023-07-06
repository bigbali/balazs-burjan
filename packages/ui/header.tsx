import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';

const PROJECTS = [
    'algorithms',
    'messages'
] as const;

const Header: FC = () => {
    const router = useRouter();
    const { asPath } = router;

    return (
        <nav className='flex items-center b w-full p-4 drop-shadow-md' id='header'>
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
        </nav>
    );
};

export default Header;
