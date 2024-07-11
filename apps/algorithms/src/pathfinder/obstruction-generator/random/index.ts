import type { ObstructionGenerator, ObstructionGeneratorOptions } from '../../../type';
import type { RandomOptions } from './options';
import { useRendererStore } from '../../hook/useRenderer';

type Options = ObstructionGeneratorOptions<RandomOptions>;

export const beginRandomObstructionGenerator: ObstructionGenerator<RandomOptions> = ({ options }) => {
    return generateRandomObstructions(options);
};

function generateRandomObstructions({ probability: p }: Options['options']) {
    const renderer = useRendererStore.getState().renderer;

    if (!renderer) {
        throw Error('no renderer');
    }

    const probability = p / 100;

    for (const node of Array.from(renderer.nodes.values())) {
        if (Math.random() <= probability) {
            node.setObstruction(true);
        }
    }

    return true;
}
