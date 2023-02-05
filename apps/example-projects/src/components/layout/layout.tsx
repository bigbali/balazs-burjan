import {
    type ForwardRefRenderFunction,
    type PropsWithChildren,
    forwardRef
} from 'react';
import Navigation from '../navigation';

forwardRef<HTMLElement, PropsWithChildren>;
type LayoutComponent = ForwardRefRenderFunction<HTMLElement, PropsWithChildren>;

const Layout: LayoutComponent = ({ children }, ref) => {
    return (
        <>
            <Navigation />
            <main className='p-64 pt-24' ref={ref}>
                {children}
            </main>
        </>
    );
};

export default forwardRef(Layout);
