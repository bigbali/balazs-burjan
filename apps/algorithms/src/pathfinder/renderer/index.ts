import type { Direction, Entry, Resolution } from '../../type';
import { Dimensions } from '../../type';
import PathfinderNode from './node';
import usePathfinderStore from '../hook/usePathfinderStore';
import { useNotificationStore } from 'ui-react19/src/store/useNotificationStore';

const DIRECTIONS_IF_ORIGIN_IS_TARGET = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
] as const satisfies Direction[];

export default class PathfinderRenderer {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    nodes: Map<string, PathfinderNode>;
    resolution: Resolution;
    origin!: PathfinderNode;
    target!: PathfinderNode;
    nodeSize!: number;
    showNumbers = true;
    showTraceVectors = false;
    borderSize = 1;
    padding!: Resolution;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d')!;
        this.nodes = new Map();

        this.resolution = {
            x: Dimensions.DEFAULT,
            y: Dimensions.DEFAULT
        };

        this.canvas.width =
            canvas.parentElement!.clientWidth * window.devicePixelRatio;
        this.canvas.height =
            canvas.parentElement!.clientHeight * window.devicePixelRatio;

        this.initialize();

        canvas.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        });
    }

    getNodeAtCursor(x: number, y: number) {
        const _x = Math.floor((x - this.padding.x) / (this.nodeSize + this.borderSize));
        const _y = Math.floor((y - this.padding.y) / (this.nodeSize + this.borderSize));

        return this.nodes.get(
            `${_x},${_y}`
        ) ?? null;
    }

    getNodeAtIndex(x: number, y: number) {
        return this.nodes.get(`${x},${y}`) ?? null;
    }

    setResolution(resolution: Resolution) {
        this.resolution = resolution;
        this.update(true);
    }

    // first we clear the previous origin and target, then set the new ones
    setOrigin(newOrigin: PathfinderNode, repaint?: boolean) {
        this.origin.setOrigin(false, repaint);
        this.origin = newOrigin;
        this.origin.setOrigin(true, repaint);
    }

    setTarget(newTarget: PathfinderNode, repaint?: boolean) {
        this.target.setTarget(false, repaint);
        this.target = newTarget;
        this.target.setTarget(true, repaint);
    }

    setShowNumbers(fn: (showNumbers: boolean) => boolean) {
        this.showNumbers = fn(this.showNumbers);
        this.paint();
    }

    setShowTraceVectors(fn: (showNumbers: boolean) => boolean) {
        this.showTraceVectors = fn(this.showTraceVectors);
        this.paint();
    }

    isOutOfBounds = (x: number, y: number) => {
        if (x >= this.resolution.x || x < 0) return true;
        if (y >= this.resolution.y || y < 0) return true;

        return false;
    };

    initialize() {
        this.#ensureContainment(true);

        for (let x = 0; x < this.resolution.x; x++) {
            for (let y = 0; y < this.resolution.y; y++) {
                const isOrigin = x === 0 && y === 0;
                const isTarget = x === this.resolution.x - 1 && y === this.resolution.y - 1;

                const node = new PathfinderNode(this, x, y, false, isTarget, isOrigin);

                isOrigin && (this.origin = node);
                isTarget && (this.target = node);

                this.nodes.set(`${x},${y}`, node);
            }
        }

        this.context.font = `${this.nodeSize * 0.6}px monospace`;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';

        this.paint();
    }

    update(rebuild?: boolean) {
        this.#ensureContainment();

        if (rebuild) {
            this.nodes.clear();

            for (let x = 0; x < this.resolution.x; x++) {
                for (let y = 0; y < this.resolution.y; y++) {
                    const isOrigin = x === this.origin.x && y === this.origin.y;
                    const isTarget = x === this.target.x && y === this.target.y;

                    const node = new PathfinderNode(this, x, y, false, isTarget, isOrigin);

                    this.nodes.set(`${x},${y}`, node);
                }
            }
        } else {
            for (const node of this.nodes.values()) {
                node.recalculatePosition();
            }
        }

        this.context.font = `${this.nodeSize * 0.6}px monospace`;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';

        this.#ensureOriginAndTargetAreWithinBounds();

        this.paint();
    }

    resize(update?: boolean) {
        this.canvas.width =
            this.canvas.parentElement!.clientWidth * window.devicePixelRatio;
        this.canvas.height =
            this.canvas.parentElement!.clientHeight * window.devicePixelRatio;

        update && this.update();
    }

    resetVisited(repaint?: boolean) {
        for (const node of this.nodes.values()) {
            node.setVisited(false, repaint);
        }
    }

    resetBacktrace(repaint?: boolean) {
        for (const node of this.nodes.values()) {
            node.setBacktrace(null, repaint);
        }
    }

    resetWeights() {
        for (const node of this.nodes.values()) {
            node.setWeight(null);
        }
    }

    clear() {
        for (const node of this.nodes.values()) {
            node.setVisited(false, false);
            node.setWeight(null, false);
            node.setBacktrace(null, true);
        }
    }

    clearObstructions() {
        for (const node of this.nodes.values()) {
            node.setObstruction(false);
        }

        this.paint();
    }

    setBacktraceFromEntry(backtraceEntry: Entry, prevDirX = 0, prevDirY = 0) {
        if (!backtraceEntry) {
            return;
        }

        const dirX = backtraceEntry.parent
            ? (backtraceEntry.node.x - (backtraceEntry.parent?.node?.x ?? 0))
            : prevDirX;
        const dirY = backtraceEntry.parent
            ? backtraceEntry.node.y - (backtraceEntry.parent?.node?.y ?? 0)
            : prevDirY;

        backtraceEntry.node.backtrace = { dirX, dirY, prevDirX, prevDirY };

        if (backtraceEntry.parent) {
            this.setBacktraceFromEntry(backtraceEntry.parent, dirX, dirY);
        }

        this.paint();
    }

    paint() {
        this.context.fillStyle = 'black';

        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (const node of this.nodes.values()) {
            node.paint();
        }
    }

    #updateNodeSize() {
        const sizeX = (this.canvas.width / this.resolution.x) - this.borderSize;
        const sizeY = (this.canvas.height / this.resolution.y) - this.borderSize;

        // set nodeSize to whichever value is smaller in order to ensure that we fit in both x and y axis
        this.nodeSize = sizeX < sizeY ? sizeX : sizeY;

        return sizeX < sizeY ? 'vertical' : 'horizontal';
    }

    #ensureOriginAndTargetAreWithinBounds() {
        const edgeX = this.resolution.x - 1;
        const edgeY = this.resolution.y - 1;

        let originX = this.origin.x;
        let originY = this.origin.y;

        if (originX > edgeX) {
            originX = edgeX;
        }

        if (originY > edgeY) {
            originY = edgeY;
        }

        let targetX = this.target.x;
        let targetY = this.target.y;

        if (targetX > edgeX) {
            targetX = edgeX;
        }

        if (targetY > edgeY) {
            targetY = edgeY;
        }

        let origin = this.getNodeAtIndex(originX, originY);
        const target = this.getNodeAtIndex(targetX, targetY);

        // if when resizing, origin gets pushed onto the target, we need to find a new origin
        while(origin === target) {
            origin?.setOrigin(false);

            useNotificationStore.getState().pushUniqueNotification({
                title: 'Origin and target are the same',
                description: 'Origin and target are the same, finding new origin...',
                type: 'info'
            });

            for (const direction of DIRECTIONS_IF_ORIGIN_IS_TARGET) {
                const newOriginX = originX + direction[0];
                const newOriginY = originY + direction[1];

                origin = this.getNodeAtIndex(newOriginX, newOriginY);
            }
        }

        origin!.backtrace = null;

        if (origin && origin !== this.origin) {
            // we don't want to repaint here as we haven't yet replaced the nodes in case we are rebuilding
            this.setOrigin(origin, true);
        }

        if (target && target !== this.target) {
            this.setTarget(target, true);
        }
        origin?.paint('purple');
    }

    #ensureContainment(initial?: boolean) {
        if (initial) {
            const orientation = this.#updateNodeSize();
            const { setColumns, setRows } = usePathfinderStore.getState();

            if (orientation === 'horizontal') {
                this.resolution.x = Math.floor(this.canvas.width / (this.nodeSize + this.borderSize));
                setColumns(this.resolution.x);
            } else {
                this.resolution.y = Math.floor(this.canvas.height / (this.nodeSize + this.borderSize));
                setRows(this.resolution.y);
            }
        } else {
            this.#updateNodeSize();
        }

        this.padding = {
            x: (this.canvas.width - (this.nodeSize + this.borderSize) * this.resolution.x + this.borderSize) / 2 - this.borderSize,
            y:  (this.canvas.height - (this.nodeSize + this.borderSize) * this.resolution.y + this.borderSize) / 2 - this.borderSize
        };
    }
}
