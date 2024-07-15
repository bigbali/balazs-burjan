import type { CellularAutomatonOptions } from './options';
import { State, type AsyncObstructionGenerator } from '../../../type';
import {
    asyncGeneratorRunner,
    pause } from '../../../util';
import { useRendererStore } from '../../hook/useRenderer';
import usePathfinderStore from '../../../renderer/usePathfinderStore';

export default class OGCellularAutomaton {
    static directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
        [-1, 1],
        [1, 1],
        [1, -1],
        [1, 1]
    ] as const;

    static begin: AsyncObstructionGenerator<CellularAutomatonOptions> = async ({ options }, resume) => {
        const renderer = useRendererStore.getState().renderer;

        if (!renderer) {
            throw Error('no renderer');
        }

        if (options.initialPattern.type === 'random' && !resume) {
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

        return await asyncGeneratorRunner(this.run(options));
    };

    static async *run(options: CellularAutomatonOptions) {
        const renderer = useRendererStore.getState().renderer!;

        if (!renderer) {
            throw Error('no renderer');
        }

        const nodes = Array.from(renderer.nodes.values());

        function step() {
            for (const node of nodes) {
                let adjacentPaths = 0;
                for (const [dx, dy] of OGCellularAutomaton.directions) {
                    const nx = node.x + dx;
                    const ny = node.y + dy;

                    if (renderer?.getNodeAtIndex(nx, ny)?.isObstruction) {
                        adjacentPaths++;
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
            const state = usePathfinderStore.getState().state;

            if (state === State.OBSTRUCTION_GENERATOR_PAUSED) {
                return pause();
            } else if (state === State.IDLE) {
                return false;
            }

            step();

            yield;
        }

        return true;
    }
}

