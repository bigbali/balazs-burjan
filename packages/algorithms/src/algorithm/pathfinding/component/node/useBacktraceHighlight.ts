import type { Entry } from '../../../../util/type';
import { useEffect } from 'react';
import type { Grid } from '../../type';

export default function useBacktraceHighlight(grid: Grid, resultNode: Entry) {
    useEffect(() => {
        if (!resultNode) return;

        let node = resultNode;
        while (node.parent) {
            node = node.parent;
            grid[node.y]![node.x]!.backtrace[1](true);
        }
    }, [grid, resultNode]);
}