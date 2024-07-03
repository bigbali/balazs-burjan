import { useMemo } from 'react';
import type { Node } from '../type';

export default function useGrid(columns: number, rows: number) {
    const grid = useMemo(() => {
        const refs = new Array<Node[]>(rows);

        for (let y = 0; y < rows; y++) {
            const row = new Array<Node>(columns);

            for (let x = 0; x < columns; x++) {
                row[x] = {
                    visited: [false, () => { }],
                    active: [false, () => { }],
                    backtrace: [false, () => { }],
                    obstruction: [false, () => { }],
                    weight: [null, () => { }],
                    reset: () => { }
                };
            }

            refs[y] = row;
        }

        return refs;
    }, [columns, rows]);

    return grid;
}