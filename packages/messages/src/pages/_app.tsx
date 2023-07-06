import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import { api } from '../utils/api';
import Layout from 'ui/layout';

import 'config/tailwind/tailwind.css';
import BASEPATH from '../utils/basepath.mjs';

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps }
}) => {
    return (
        <SessionProvider session={session} basePath={`http://localhost:3002${BASEPATH}/api/auth`}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </SessionProvider>
    );
};

export default api.withTRPC(MyApp);
