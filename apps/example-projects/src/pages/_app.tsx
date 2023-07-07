import { type AppType } from 'next/app';

import Layout from 'ui/layout';

import 'config/tailwind/tailwind.css';
import '../styles/font.css';

const MyApp: AppType = ({
    Component,
    pageProps: { ...pageProps }
}) => {
    return (
        <Layout title='Projects' description='Projects by Balázs Burján'>
            <Component {...pageProps} />
        </Layout>
    );
};

export default MyApp;
