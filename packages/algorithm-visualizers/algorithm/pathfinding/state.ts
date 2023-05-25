// TypeScript doesn't like this being in the correct place, so we have to move it elsewhere (here).
// Basically, it's a circular reference thing.
export enum PathfinderState {
    STOPPED = 'stopped',
    RUNNING = 'running',
    PAUSED = 'paused',
    DONE = 'done'
};
