import type { AppType } from 'next/app';
import { useEffect, useRef } from 'react';
import { Layout } from 'ui-react19';
import 'config/tailwind/tailwind.css';

const Algorithms: AppType = ({ Component }) => {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        if (ref.current) {
            // set the height to 100vh - Header height, filling the screen vertically
            ref.current.style.height = `calc(100vh - ${ref.current.offsetTop}px)`;
        }
    });

    return (
        <Layout title='Algorithms' description='See how algorithms work with your own eyes.' ref={ref}>
            <Component />
        </Layout>
    );
};

export default Algorithms;
