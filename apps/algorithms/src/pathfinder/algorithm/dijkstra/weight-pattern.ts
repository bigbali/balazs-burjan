import { useRendererStore } from '../../hook/useRenderer';

export enum WeightPattern {
    GRAVITATIONAL = 'gravitational',
    RANDOM = 'random',
    MANUAL = 'manual'
}

export const generateRandomWeightPattern = () => {
    const renderer = useRendererStore.getState().renderer;

    if (!renderer) {
        throw Error('no renderer');
    }

    for (const node of Array.from(renderer.nodes.values())) {
        const random = Math.random();

        node.setWeight(Math.round(random * 255));
    }
};

export const generateGravitationalWeightPattern = () => {
    const renderer = useRendererStore.getState().renderer;

    if (!renderer) {
        throw Error('no renderer');
    }

    for (const node of Array.from(renderer.nodes.values())) {
        const distance = Math.sqrt(Math.pow(renderer.target.y - node.y, 2) + Math.pow(renderer.target.x - node.x, 2));

        node.setWeight((Math.round((distance / renderer.resolution.x * 255))));
    }
};