import { type AppType } from 'next/app';
import { type Session } from 'next-auth';

import Layout from '../components/layout';

import '@local/config/tailwind/tailwind.css';
import '../styles/font.css';

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { ...pageProps }
}) => {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
};

export default MyApp;
