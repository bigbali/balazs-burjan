import { type AppType } from 'next/app';

import Layout from '../components/layout';

import '@local/config/tailwind/tailwind.css';
import '../styles/font.css';

const MyApp: AppType = ({
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
