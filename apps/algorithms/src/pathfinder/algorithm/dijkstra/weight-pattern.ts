import { usePathfinderRendererStore } from '../../hook/usePathfinderRenderer';

export const generateRandomWeightPattern = () => {
    const renderer = usePathfinderRendererStore.getState().renderer;

    if (!renderer) {
        throw Error('no renderer');
    }

    for (const node of Array.from(renderer.nodes.values())) {
        const random = Math.random();

        node.setWeight(Math.round(random * 255));
    }
};

export const generateGravitationalWeightPattern = () => {
    const renderer = usePathfinderRendererStore.getState().renderer;

    if (!renderer) {
        throw Error('no renderer');
    }

    for (const node of Array.from(renderer.nodes.values())) {
        const distance = Math.sqrt(Math.pow(renderer.target.y - node.y, 2) + Math.pow(renderer.target.x - node.x, 2));

        node.setWeight((Math.round((distance / renderer.resolution.x * 255))));
    }
};