import type { Dispatch, SetStateAction } from 'react';
import { generateGravitationalWeightPattern, generateRandomWeightPattern, WeightPattern } from './weight-pattern';

type DijkstraOptionsType = {
    weightPattern: WeightPattern,
};

export const dijkstraDefaultOptions: DijkstraOptionsType = {
    weightPattern: WeightPattern.GRAVITATIONAL
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
                    Weight Pattern:
                </label>
                <select
                    id='dijsktraweight'
                    className='px-4 capitalize border rounded-md border-slate-3'
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
                    className='w-full px-4 py-2 font-medium text-white rounded-lg bg-sky-700'
                    onClick={() => generateRandomWeightPattern()}
                >
                    Generate Random Weight Pattern
                </button>
            )}
            {options.weightPattern === WeightPattern.GRAVITATIONAL && (
                <button
                    className='w-full px-4 py-2 font-medium text-white rounded-lg bg-sky-700'
                    onClick={() => generateGravitationalWeightPattern()}
                >
                    Generate Gravitational Weight Pattern
                </button>
            )}
        </div>
    );
};
