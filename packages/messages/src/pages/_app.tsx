import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import { api } from '../utils/api';
import Layout from 'ui/layout';

import 'config/tailwind/tailwind.css';
import { BASEPATH } from '../utils/zone.mjs';

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps }
}) => {
    return (
        <SessionProvider session={session} basePath={`${BASEPATH}/api/auth`}>
            <Layout title='Messages' description='A messaging application using Next.js and Prisma' auth>
                <Component {...pageProps} />
            </Layout>
        </SessionProvider>
    );
};

export default api.withTRPC(MyApp);
