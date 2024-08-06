import type { AppType } from 'next/app';
import { useEffect, useRef } from 'react';
import { Layout } from 'ui-react19';
import 'config/tailwind/tailwind.css';
import '../style/main.css';

const Algorithms: AppType = ({ Component }) => {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        if (ref.current) {
            // make sure the overall height is 100vh including the external Header component
            ref.current.style.height = `calc(100vh - ${ref.current.offsetTop}px)`;
        }
    });

    return (
        <Layout title='Algorithms' description='See with your own eyes the steps these algorithms take to get results!' ref={ref}>
            <Component />
        </Layout>
    );
};

export default Algorithms;
