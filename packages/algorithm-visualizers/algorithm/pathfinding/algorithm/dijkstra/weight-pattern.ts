import type { NodeReferences } from '../..';
import type { Coordinate } from '../../../../util/common';

export enum WeightPattern {
    GRAVITATIONAL = 'gravitational',
    RANDOM = 'random',
    MANUAL = 'manual'
};

export const setWeightManually = (node: NodeReferences) => {

};

export const generateRandomWeightPattern = (nodeReferences: NodeReferences[][] | null) => {
    if (!nodeReferences) {
        return;
    }

    for (const row of nodeReferences) {
        for (const nodeReference of row) {
            const random = Math.random();

            if (random > 0.75) {
                const [, setWeight] = nodeReference.weight.current;
                setWeight(Math.round(random * nodeReferences.length));
            }
        }
    }
};

export const generateGravitationalWeightPattern = (nodeReferences: NodeReferences[][] | null, goal: Coordinate | null) => {
    if (!nodeReferences || !goal) {
        return;
    }

    for (let y = 0; y < nodeReferences.length; y++) {
        for (let x = 0; x < nodeReferences[0]!.length; x++) {
            const distance = Math.sqrt(Math.pow(goal.y - y, 2) + Math.pow(goal.x - x, 2));
            nodeReferences[y]![x]!.weight.current[1](Math.round((distance / nodeReferences.length * 255)));
        }
    }
};