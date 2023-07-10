import type { Dispatch, SetStateAction } from 'react';
import type { NodeReferences } from '../..';
import type { Coordinate } from '../../../../src/util/common';
import { generateGravitationalWeightPattern, generateRandomWeightPattern, WeightPattern } from './weight-pattern';

type DijkstraOptionsType = {
    weightPattern: WeightPattern,
    nodeReferences: NodeReferences[][] | null,
    goal: Coordinate | null
};

export const dijkstraDefaultOptions: DijkstraOptionsType = {
    weightPattern: WeightPattern.GRAVITATIONAL,
    nodeReferences: null,
    goal: null
};

export type DijkstraOptionsProps = {
    options: DijkstraOptionsType,
    setOptions: Dispatch<SetStateAction<DijkstraOptionsType>>
};

export const DijkstraOptions = ({ options, setOptions }: DijkstraOptionsProps) => {
    return (
        <div className='flex flex-col gap-2'>
            <div className='flex gap-2'>
                <label htmlFor='dijkstraweight'>
                    Weight:
                </label>
                <select
                    id='dijsktraweight'
                    className='border border-slate-3 rounded-md capitalize px-4'
                    value={options.weightPattern}
                    onChange={(e) => {
                        setOptions({
                            ...options,
                            weightPattern: e.currentTarget.value as WeightPattern
                        });
                    }}>
                    {Object.values(WeightPattern).map((value) => (
                        <option key={value} value={value}>
                            {value}
                        </option>
                    ))}
                </select>
            </div>
            {options.weightPattern === WeightPattern.RANDOM && (
                <button
                    className='bg-sky-700 text-white font-medium px-4 py-2 rounded-lg w-fit'
                    onClick={() => generateRandomWeightPattern(options.nodeReferences)}
                >
                    Generate Random Weight Pattern
                </button>
            )}
            {options.weightPattern === WeightPattern.GRAVITATIONAL && (
                <button
                    className='bg-sky-700 text-white font-medium px-4 py-2 rounded-lg w-fit'
                    onClick={() => generateGravitationalWeightPattern(options.nodeReferences, options.goal)}
                >
                    Generate Gravitational Weight Pattern
                </button>
            )}
        </div>
    );
};
