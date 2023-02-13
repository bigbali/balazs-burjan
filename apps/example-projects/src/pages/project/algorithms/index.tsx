import dynamic from 'next/dynamic';

// export { default } from '../../../components/_pages/algorithms';

export default dynamic(() => import('../../../components/_pages/algorithms'), { ssr: false });
