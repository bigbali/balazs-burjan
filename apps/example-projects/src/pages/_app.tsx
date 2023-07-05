import { type AppType } from 'next/app';

import Layout from 'ui/layout';

import 'config/tailwind/tailwind.css';
import '../styles/font.css';

const MyApp: AppType = ({
    Component
}) => {
    return (
        <Layout>
            <Component />
        </Layout>
    );
};

export default MyApp;
