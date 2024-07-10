import type { Entry } from '../../type';
import { useEffect } from 'react';
import { useRendererStore } from './useRenderer';

export default function useBacktraceHighlight(resultNode: Entry) {
    // check if we are re-rendering, in which case we should not backtrace the nodes
    let hasRun = false;

    useEffect(() => {
        if (!resultNode || hasRun) return;

        const renderer = useRendererStore.getState().renderer;

        if (!renderer) throw Error('no renderer');

        let node = resultNode;
        while (node.parent) {
            node = node.parent;

            renderer.getNodeAtIndex(node.x, node.y)?.setBacktrace();
        }

        hasRun = true;
    }, [resultNode]);
}