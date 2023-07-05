import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

import { api } from '../utils/api';

type Project = {
    name: string,
    slug: string,
    color: string
};

const PROJECTS = [
    {
        name: 'Messages',
        slug: 'messages',
        color: 'green'
    },
    {
        name: 'Algorithms',
        slug: 'algorithms',
        color: 'purple'
    }
] satisfies Project[];

const Home: NextPage = () => {
    const hello = api.example.hello.useQuery({ text: 'from tRPC' });

    return (
        <>
            <Head>
                <title>Example Projects by Balázs Burján</title>
                <meta name='description' content='Generated by create-t3-app' />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <main className='flex min-h-screen flex-col items-center justify-center bg-theme-dark-bg'>
                <div className='container flex flex-col items-center justify-center gap-12 px-4 py-16 '>
                    <h1 className='text-5xl font-bold text-white'>
                        Example Projects
                        <div>
                            <span>
                                by&nbsp;
                            </span>
                            <span className='text-theme-red'>
                                Balázs Burján
                            </span>
                        </div>
                    </h1>
                    <div className='grid grid-flow-col auto-cols-fr gap-4'>
                        {PROJECTS.map((project) => (
                            <Link key={project.slug} href={`project/${project.slug}`}>
                                <div
                                    style={{ background: project.color }}
                                    className={`
                                        aspect-square flex justify-center items-center p-4 px-12
                                        rounded-lg border border-[rgb(255,255,255,0.15)]
                                    `}
                                >
                                    <h2 className='text-3xl font-medium text-white'>
                                        {project.name}
                                    </h2>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className='flex flex-col items-center gap-2'>
                        <p className='text-2xl text-white'>
                            {hello.data ? hello.data.greeting : 'Loading tRPC query...'}
                        </p>
                        <AuthShowcase />
                    </div>
                </div>
            </main>
        </>
    );
};

export default Home;

const AuthShowcase: React.FC = () => {
    const { data: sessionData } = useSession();

    const { data: secretMessage } = api.example.getSecretMessage.useQuery(
        undefined, // no input
        { enabled: sessionData?.user !== undefined }
    );

    return (
        <div className='flex flex-col items-center justify-center gap-4'>
            <p className='text-center text-2xl text-white'>
                {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
                {secretMessage && <span> - {secretMessage}</span>}
            </p>
            <button
                className='rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20'
                onClick={sessionData ? () => void signOut() : () => void signIn()}
            >
                {sessionData ? 'Sign out' : 'Sign in'}
            </button>
        </div>
    );
};
