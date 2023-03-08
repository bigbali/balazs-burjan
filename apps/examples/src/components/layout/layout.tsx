import {
    type ForwardRefRenderFunction,
    type PropsWithChildren,
    forwardRef
} from 'react';
import { useLoading } from '../../store/loading';
import Navigation from '../navigation';

forwardRef<HTMLElement, PropsWithChildren>;
type LayoutComponent = ForwardRefRenderFunction<HTMLElement, PropsWithChildren>;

const Layout: LayoutComponent = ({ children }, ref) => {
    const isLoading = useLoading(state => state.isLoading);
    return (
        <>
            <Navigation />
            {isLoading && (
                <div className='absolute inset-0 z-10 bg-pink-400 grid place-items-center'>
                    <h1 className='text-4xl text-center'>
                        LOADING YO
                    </h1>
                </div>
            )}
            <main ref={ref}>
                {children}
            </main>
        </>
    );
};

export default forwardRef(Layout);
