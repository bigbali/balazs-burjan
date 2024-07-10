import type { CellularAutomataOptions } from './options';
import type { AsyncObstructionGenerator } from '../../../type';
import type { Coordinate } from '../../..//type';
import {
    asyncGeneratorRunner,
    setupPathfinder,
    isOutOfBounds
} from '../../../util';
import { useRendererStore } from '../../hook/useRenderer';

const queue: Coordinate[] = [];
const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, 1],
    [1, 1],
    [1, -1],
    [1, 1]
] as const;

export const beginCAObstructionGenerator: AsyncObstructionGenerator<CellularAutomataOptions> =
    async ({ delay, options }) => {
        const renderer = useRendererStore.getState().renderer;

        if (!renderer) {
            throw Error('no renderer');
        }

        if (options.initialPattern.type === 'random') {
            for (const node of renderer!.nodes!.values()) {
                if (Math.random() <= (
                    options.initialPattern.type === 'random'
                        ? options.initialPattern.probability / 100
                        : 0)
                ) {
                    node.setObstruction(true);
                }
            }
        }

        if (options.interrupt) {
            options.interrupt.current = false;
        }

        setupPathfinder(
            queue,
            {
                x: renderer.origin.x,
                y: renderer.origin.y
            },
            false
        );

        return await asyncGeneratorRunner(caObstructionGenerator(options), delay);
    };

async function* caObstructionGenerator(options: CellularAutomataOptions) {
    const renderer = useRendererStore.getState().renderer!;

    if (!renderer) {
        throw Error('no renderer');
    }

    const nodes = Array.from(renderer.nodes.values());

    function step() {
        for (const node of nodes) {
            let adjacentPaths = 0;
            for (const [dx, dy] of directions) {
                const nx = node.x + dx;
                const ny = node.y + dy;

                if (!isOutOfBounds(nx, ny, renderer.resolution)) {
                    if (renderer?.getNodeAtIndex(nx, ny)?.isObstruction) {
                        adjacentPaths++;
                    }
                }
            }

            if (adjacentPaths === options.setAlive && !node.isObstruction) {
                node.setObstruction(true);
            }
            else if (node.isObstruction &&
                    (adjacentPaths < options.keepAlive.min || adjacentPaths > options.keepAlive.max)) {
                node.setObstruction(false);
            }
        }
    }

    for (let i = 0; i < options.steps; i++) {
        if (options.interrupt?.current) {
            return true;
        }

        step();

        yield;
    }

    return true;
}

