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
            <main className='Page' ref={ref}>
                {children}
            </main>
        </>
    );
};

export default forwardRef(Layout);
