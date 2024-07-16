import { usePathfinderRendererStore } from '../pathfinder/hook/usePathfinderRenderer';
import usePathfinderStore from '../pathfinder/hook/usePathfinderStore';
import type { Paused } from '../type';

type GeneratorRunner = <T>(
    generator: Generator<unknown, T, unknown>
) => Promise<T | Paused>;

type AsyncGeneratorRunner = <T>(
    generator: AsyncGenerator<unknown, T, unknown>
) => Promise<T | Paused>;

/**
 * A generator runner that recursively calls itself.
 * @param generator
 * @returns the result of the generator
 */
export const generatorRunner: GeneratorRunner = async (generator) => {
    const interval = usePathfinderStore.getState().stepInterval;
    const result = generator.next();

    if (result.done) {
        return result.value;
    }

    let timeout: NodeJS.Timeout;
    await new Promise((resolve) => {
        timeout = setTimeout(resolve, interval.current);
    }).then(() => clearTimeout(timeout));


    return await generatorRunner(generator);
};

export const asyncGeneratorRunner: AsyncGeneratorRunner = async (generator) => {
    const interval = usePathfinderStore.getState().stepInterval;
    const result = await generator.next();

    if (result.done) {
        return result.value;
    }

    let timeout: NodeJS.Timeout;
    await new Promise((resolve) => {
        timeout = setTimeout(resolve, interval.current);
    }).then(() => clearTimeout(timeout));

    return await asyncGeneratorRunner(generator);
};

export const pause = (): Paused => ({ paused: true });

type ArrayLike = {
    push: (...args: any[]) => any,
    clear: () => void,
};

type SetupPathfinder = <T>(
    entries: ArrayLike,
    initialEntry: T,
    resume?: boolean
) => void;


declare global {
  interface Array<T>  {
    clear(): void
  }
}

Array.prototype.clear = function(this: []) {
    this.length = 0;
};

export const setupPathfinder: SetupPathfinder = (entries, initialEntry, resume) => {
    if (!resume) {
        entries.clear();
        usePathfinderRendererStore.getState().renderer?.resetVisited();

        Array.isArray(initialEntry)
            ? entries.push(...initialEntry)
            : entries.push(initialEntry);
    }
};
