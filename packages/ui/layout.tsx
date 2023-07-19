import type {
    FC,
    PropsWithChildren
} from 'react';
import {
    forwardRef
} from 'react';
import Head from 'next/head';
import Header from './header';

type LayoutProps = {
    title?: string,
    description?: string,
    favicon?: string,
    auth?: boolean
} & PropsWithChildren;

const Layout: FC<LayoutProps> = forwardRef<HTMLElement, LayoutProps>(
    function Layout({ children, title, description, favicon, auth = false }, ref) {
        return (
            <>
                <Head>
                    <title>
                        {title}
                    </title>
                    <meta name='description' content={description} />
                    <link rel='icon' href={favicon} />
                </Head>
                <Header auth={auth} />
                <main ref={ref}>
                    {children}
                </main>
            </>
        );
    });

export default Layout;
