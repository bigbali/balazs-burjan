import type { AppType } from 'next/app';
import Layout from 'ui/layout';
import 'config/tailwind/tailwind.css';

const Algorithms: AppType = ({
    Component,
    pageProps: { ...pageProps }
}) => {
    return (
        <Layout title='Algorithms' description='See how algorithms work with your own eyes.'>
            <Component {...pageProps} />
        </Layout>
    );
};

export default Algorithms;
