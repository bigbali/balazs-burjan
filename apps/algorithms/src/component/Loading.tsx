import { useLoading } from '../store/useLoading';

export default function Loading() {
    const { isLoading } = useLoading();

    if (!isLoading) return null;

    return (
        <div className='fixed inset-0 z-50 bg-theme-red'>Loading</div>
    );
}
