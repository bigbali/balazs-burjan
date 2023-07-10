import type { AppType } from 'next/app';
import Layout from 'ui/layout';
import 'config/tailwind/tailwind.css';

const Algorithms: AppType = ({
    Component,
    pageProps: { ...pageProps }
}) => {
    return (
        <Layout title='Messages' description='A messaging application using Next.js and Prisma'>
            <Component {...pageProps} />
        </Layout>
    );
};

export default Algorithms;
