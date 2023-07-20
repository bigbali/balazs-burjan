import type { NodeControlsMenuStore } from '.';

export const position = (
    node: NodeControlsMenuStore['node'],
    grid: NodeControlsMenuStore['grid'],
    nodeSize: NodeControlsMenuStore['nodeSize']
) => {
    if (!node || !grid) return {
        left: 0,
        top: 0
    };

    const gridRect = grid.getBoundingClientRect();
    const nodeRect = node.getClientRect();
    const { x, y, height } = nodeRect;

    const shouldRenderUpwards = (y + gridRect.y) + height > window.innerHeight / 2;

    const left = x + nodeSize;
    const top = !shouldRenderUpwards
        ? y + nodeSize
        : undefined;
    const bottom = shouldRenderUpwards
        ? gridRect.height - y
        : undefined;

    return {
        left,
        top,
        bottom
    };
};
