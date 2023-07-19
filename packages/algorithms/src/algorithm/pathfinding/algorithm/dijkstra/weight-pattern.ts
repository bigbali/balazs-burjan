import type { Coordinate } from '../../../../util/type';
import type { Grid } from '../../type';

export enum WeightPattern {
    GRAVITATIONAL = 'gravitational',
    RANDOM = 'random',
    MANUAL = 'manual'
};

export const generateRandomWeightPattern = (grid: Grid | null) => {
    if (!grid) {
        return;
    }

    for (const row of grid) {
        for (const nodeReference of row) {
            const random = Math.random();

            if (random > 0.75) {
                const [, setWeight] = nodeReference.weight;
                setWeight(Math.round(random * grid.length));
            }
        }
    }
};

export const generateGravitationalWeightPattern = (grid: Grid | null, goal: Coordinate | null) => {
    if (!grid || !goal) {
        return;
    }

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0]!.length; x++) {
            const distance = Math.sqrt(Math.pow(goal.y - y, 2) + Math.pow(goal.x - x, 2));
            grid[y]![x]!.weight[1](Math.round((distance / grid.length * 255)));
        }
    }
};