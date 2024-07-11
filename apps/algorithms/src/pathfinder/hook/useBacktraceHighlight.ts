import type { Entry } from '../../type';
import { useEffect } from 'react';
import { useRendererStore } from './useRenderer';

export default function useBacktraceHighlight(result: Entry) {
    // check if we are re-rendering, in which case we should not backtrace the nodes
    let hasRun = false;

    useEffect(() => {
        if (!result || hasRun) return;

        const renderer = useRendererStore.getState().renderer;

        if (!renderer) throw Error('no renderer');

        let entry = result;
        while (entry.parent) {
            entry = entry.parent;

            entry.node.setBacktrace();
        }

        hasRun = true;
    }, [result]);
}