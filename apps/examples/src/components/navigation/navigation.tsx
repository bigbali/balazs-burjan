import Link from 'next/link';
import { useRouter } from 'next/router';
import PROJECTS from '../../data/projects';

const Navigation = () => {
    const router = useRouter();
    const { asPath } = router;

    return (
        <nav className='flex items-center border-b-red-400 border-b w-full p-4'>
            <Link href='/' className='text-2xl font-medium'>
                Example Projects
            </Link>
            <ul className='flex ml-auto gap-4 capitalize text-lg'>
                {PROJECTS.map(project => {
                    const isCurrent = asPath.slice('/project/'.length) === project;

                    return (
                        <li key={project}>
                            <Link href={`/project/${project}`} className={`hover:text-red-600 ${isCurrent ? 'text-red-500' : ''}`}>
                                {project}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Navigation;
