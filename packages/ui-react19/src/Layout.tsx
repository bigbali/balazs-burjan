import type {
    PropsWithChildren,
    RefObject
} from 'react';
import Head from 'next/head';
import Header from './Header';

type LayoutProps = {
    title?: string,
    description?: string,
    favicon?: string,
    auth?: boolean,
    ref?: RefObject<HTMLElement>
} & PropsWithChildren;

export default function Layout (
    { children, title, description, favicon, auth = false, ref }: LayoutProps
) {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name='description' content={description} />
                <link rel='icon' href={favicon} />
            </Head>
            <Header auth={auth} />
            <main ref={ref}>{children}</main>
        </>
    );
}
