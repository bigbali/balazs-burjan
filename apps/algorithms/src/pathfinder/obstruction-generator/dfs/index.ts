import { State, type AsyncObstructionGenerator } from '../../../type';
import type Node from '../../../renderer/node';
import shuffle from 'lodash/shuffle';
import {
    generatorRunner,
    pause
} from '../../../util';
import { useRendererStore } from '../../hook/useRenderer';
import usePathfinderStore from '../../../renderer/usePathfinderStore';

export default class OGRandomizedDepthFirstSearch {
    static directions = [
        [-2, 0],
        [2, 0],
        [0, -2],
        [0, 2]
    ] as const;

    static stack: Node[] = [];

    static begin: AsyncObstructionGenerator = async (_, resume: boolean) => {
        const renderer = useRendererStore.getState().renderer;

        if (!renderer) {
            throw Error('no renderer');
        }

        if (!resume) {
            for (const node of Array.from(renderer.nodes.values())) {
                if (node.isOrigin || node.isTarget) {
                    continue;
                }

                node.setObstruction(true);
            }
        }

        this.stack.push(renderer.origin);

        return await generatorRunner(this.run());
    };

    static *run() {
        const renderer = useRendererStore.getState().renderer;

        if (!renderer) {
            throw Error('no renderer');
        }

        while (this.stack.length > 0) {
            const state = usePathfinderStore.getState().state;

            if (state === State.OBSTRUCTION_GENERATOR_PAUSED) {
                return pause();
            } else if (state === State.IDLE) {
                return false;
            }

            const node = this.stack.pop()!;

            for (const [dx, dy] of shuffle(this.directions)) {
                const x = node.x + dx;
                const y = node.y + dy;

                const adjacentNode = renderer.getNodeAtIndex(x, y);

                if (adjacentNode && adjacentNode.isObstruction) {
                    adjacentNode.setObstruction(false);

                    const mx = node.x + (dx / 2);
                    const my = node.y + (dy / 2);

                    const mNode = renderer.getNodeAtIndex(mx, my);

                    if (mNode) {
                        mNode.setObstruction(false);

                        this.stack.push(adjacentNode);
                    }
                }
            }

            yield;
        }

        return true;
    }
}
