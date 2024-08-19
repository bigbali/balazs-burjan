import type { Entry, Paused } from '../../type';
import { useEffect } from 'react';
import { usePathfinderRendererStore } from './usePathfinderRenderer';

export default function useBacktraceHighlight(result: Entry | Paused) {
    // check if we are re-rendering, in which case we should not backtrace the nodes
    let hasRun = false;

    useEffect(() => {
        if (!result || 'paused' in result || hasRun) return;

        const renderer = usePathfinderRendererStore.getState().renderer;

        if (!renderer) throw Error('no renderer');

        // let entry = result;
        // let entry2 = result;


        // while (entry.parent) {
        //     entry.node.setBacktrace();
        //     entry = entry.parent;
        // }


        // renderer.backtraceEntry = result;
        renderer.setBacktraceFromEntry(result);


        // eslint-disable-next-line react-hooks/exhaustive-deps
        hasRun = true;
    }, [result]);
}