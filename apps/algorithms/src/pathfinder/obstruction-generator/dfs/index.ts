import shuffle from 'lodash/shuffle';
import {
    generatorRunner
} from '../../../util';
import type { AsyncObstructionGenerator, Direction } from '../../../type';
import { useRendererStore } from '../../hook/useRenderer';
import type Node from '../../../renderer/node';
import type Renderer from '../../../renderer';

const stack: Node[] = [];
const directions = [
    [-2, 0],
    [2, 0],
    [0, -2],
    [0, 2]
] as const satisfies Direction[];

export const beginDFSObstructionGenerator: AsyncObstructionGenerator = async ({ delay }) => {
    const renderer = useRendererStore.getState().renderer;

    if (!renderer) {
        throw Error('no renderer');
    }

    for (const node of Array.from(renderer.nodes.values())) {
        if (node.isOrigin || node.isTarget) {
            continue;
        }

        node.setObstruction(true);
    }

    stack.push(renderer.origin);

    return await generatorRunner(dfsObstructionGenerator(renderer), delay);
};

function* dfsObstructionGenerator(renderer: Renderer) {
    while (stack.length > 0) {
        const node = stack.pop()!;

        for (const [dx, dy] of shuffle(directions)) {
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

                    stack.push(adjacentNode);
                }
            }
        }

        yield;
    }

    return true;
}

