import type {
    ForwardRefRenderFunction,
    PropsWithChildren
} from 'react';
import {
    forwardRef
} from 'react';
import Head from 'next/head';
import Header from './Header';

type LayoutProps = {
    title?: string,
    description?: string,
    favicon?: string,
    auth?: boolean
} & PropsWithChildren;

const Layout: ForwardRefRenderFunction<HTMLElement, LayoutProps> = function (
    { children, title, description, favicon, auth = false },
    ref
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
};

export default forwardRef(Layout);
