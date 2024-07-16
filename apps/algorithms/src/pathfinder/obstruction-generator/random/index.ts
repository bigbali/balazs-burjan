import type { ObstructionGeneratorOptions } from '../../../type';
import type { OGRandomOptions } from './options';
import { usePathfinderRendererStore } from '../../hook/usePathfinderRenderer';

type Options = ObstructionGeneratorOptions<OGRandomOptions>;

export default class OGRandom {
    static begin  ({ options }: Options)  {
        return this.run(options);
    }

    static run({ probability: p }: OGRandomOptions) {
        const renderer = usePathfinderRendererStore.getState().renderer;

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
}

