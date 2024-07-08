import type { GridData } from '../algorithm/pathfinding/component/Grid';
import Node from './node';

type Resolution = {
    x: number,
    y: number
};

export default class Canvas {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    nodes: Map<string, Node>;
    showNumbers = true;
    borderSize = 1;
    resolution: Resolution;
    origin: Node;
    target: Node;
    nodeSize: number;

    constructor(
        canvas: HTMLCanvasElement,
        resolution: Resolution,
        data: GridData
    ) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d')!;
        this.nodes = new Map();

        this.resolution = resolution;

        this.canvas.width =
            canvas.parentElement!.clientWidth * window.devicePixelRatio;
        this.canvas.height =
            canvas.parentElement!.clientHeight * window.devicePixelRatio;

        this.nodeSize = 
            this.canvas.width / this.resolution.x -
            this.borderSize / this.resolution.x -
            this.borderSize;
        // this.nodeSize = Math.ceil(
        //     this.canvas.width / this.resolution.x -
        //     this.borderSize / this.resolution.x -
        //     this.borderSize);

        const { origin, target } = this.initialize(data);

        this.origin = origin;
        this.target = target;
    }

    setResolution(resolution: Resolution) {
        this.resolution = resolution;
        this.update();
    }

    setOrigin(newOrigin: Node) {
        this.origin.isOrigin = false;
        this.origin.paint();

        this.origin = newOrigin;
        this.origin.isOrigin = true;
        this.origin.paint();
    }

    setTarget(newTarget: Node) {
        this.target.isTarget = false;
        this.target.paint();

        this.target = newTarget;
        this.target.isTarget = true;
        this.target.paint();
    }

    getNodeAtCursor(x: number, y: number) {
        return this.nodes.get(
            `${Math.floor(x / (this.nodeSize + this.borderSize))},${Math.floor(y / (this.nodeSize + this.borderSize))}`
        );
    }

    getNodeAtIndex(x: number, y: number) {
        return this.nodes.get(`${x},${y}`);
    }

    initialize(data: GridData) {
        let origin!: Node;
        let target!: Node;

        for (let x = 0; x < this.resolution.x; x++) {
            for (let y = 0; y < this.resolution.y; y++) {
                const isOrigin = x === data.origin.x && y === data.origin.y;
                const isTarget = x === data.target.x && y === data.target.y;

                const node = new Node(this, x, y, false, isTarget, isOrigin);

                isOrigin && (origin = node);
                isTarget && (target = node);

                this.nodes.set(`${x},${y}`, node);
            }
        }

        this.context.font = `${this.nodeSize * 0.6}px monospace`;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        // this.context.translate(0.5, 0.5)

        this.paint();

        return { origin, target };
    }

    update() {
        this.nodes.clear();

        this.#updateNodeSize();

        for (let x = 0; x < this.resolution.x; x++) {
            for (let y = 0; y < this.resolution.y; y++) {
                const isOrigin = x === this.origin.x && y === this.origin.y;
                const isTarget = x === this.target.x && y === this.target.y;

                const node = new Node(this, x, y, false, isTarget, isOrigin);

                this.nodes.set(`${x},${y}`, node);
            }
        }

        this.#ensureOriginAndTargetAreWithinBounds();

        this.paint();
    }

    #updateNodeSize() {
        this.nodeSize =
            this.canvas.width / this.resolution.x -
            this.borderSize / this.resolution.x -
            this.borderSize;
    }

    paint() {
        this.context.fillStyle = 'black';

        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (const node of this.nodes.values()) {
            node.paint();
        }
    }

    setShowNumbers(fn: (showNumbers: boolean) => boolean) {
        this.showNumbers = fn(this.showNumbers);
        this.paint();
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

        const origin = this.getNodeAtIndex(originX, originY);

        if (origin && origin !== this.origin) {
            this.setOrigin(origin);
        }

        let targetX = this.target.x;
        let targetY = this.target.y;

        if (targetX > edgeX) {
            targetX = edgeX;
        }

        if (targetY > edgeY) {
            targetY = edgeY;
        }

        const target = this.getNodeAtIndex(targetX, targetY);

        if (target && target !== this.target) {
            this.setTarget(target);
        }
    }
}
