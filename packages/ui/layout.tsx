import {
    type ForwardRefRenderFunction,
    type PropsWithChildren,
    forwardRef
} from 'react';
import Header from './header';

forwardRef<HTMLElement, PropsWithChildren>;
type LayoutComponent = ForwardRefRenderFunction<HTMLElement, PropsWithChildren>;

const Layout: LayoutComponent = ({ children }, ref) => {
    return (
        <>
            <Header />
            <main ref={ref}>
                {children}
            </main>
        </>
    );
};

export default forwardRef(Layout);
