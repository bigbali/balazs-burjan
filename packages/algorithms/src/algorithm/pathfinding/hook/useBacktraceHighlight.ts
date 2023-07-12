import type { NodeRefGrid } from '..';
import type { Entry } from '../../../util/algorithm';
import { useEffect } from 'react';

export default function useBacktraceHighlight(nodes: NodeRefGrid, resultNode: Entry) {
    useEffect(() => {
        if (!resultNode) return;

        let node = resultNode;
        while (node.parent) {
            node = node.parent;
            nodes[node.y]![node.x]!.setIsHighlighted.current(true);
        }
    }, [nodes, resultNode]);
}