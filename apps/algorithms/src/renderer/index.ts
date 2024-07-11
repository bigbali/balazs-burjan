import type { Resolution } from '../type';
import { Dimensions } from '../type';
import Node from './node';

const INITIAL_ORIGIN = {
    x: 0,
    y: 0
};

const INITIAL_TARGET = {
    x: Dimensions.DEFAULT - 1,
    y: Dimensions.DEFAULT - 1
};

export default class Renderer {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    nodes: Map<string, Node>;
    resolution: Resolution;
    origin!: Node;
    target!: Node;
    nodeSize: number;
    showNumbers = true;
    borderSize = 1;

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

        this.nodeSize =
            this.canvas.width / this.resolution.x -
            this.borderSize / this.resolution.x -
            this.borderSize;

        this.initialize();

        canvas.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        });
    }

    getNodeAtCursor(x: number, y: number) {
        return this.nodes.get(
            `${Math.floor(x / (this.nodeSize + this.borderSize))},${Math.floor(y / (this.nodeSize + this.borderSize))}`
        ) ?? null;
    }

    getNodeAtIndex(x: number, y: number) {
        return this.nodes.get(`${x},${y}`) ?? null;
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

    setShowNumbers(fn: (showNumbers: boolean) => boolean) {
        this.showNumbers = fn(this.showNumbers);
        this.paint();
    }

    isOutOfBounds = (x: number, y: number) => {
        if (x >= this.resolution.x || x < 0) return true;
        if (y >= this.resolution.y || y < 0) return true;

        return false;
    };


    initialize() {
        for (let x = 0; x < this.resolution.x; x++) {
            for (let y = 0; y < this.resolution.y; y++) {
                const isOrigin = x === INITIAL_ORIGIN.x && y === INITIAL_ORIGIN.y;
                const isTarget = x === INITIAL_TARGET.x && y === INITIAL_TARGET.y;

                const node = new Node(this, x, y, false, isTarget, isOrigin);

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

        this.context.font = `${this.nodeSize * 0.6}px monospace`;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';

        this.#ensureOriginAndTargetAreWithinBounds();

        this.paint();
    }

    resize() {
        this.canvas.width =
            this.canvas.parentElement!.clientWidth * window.devicePixelRatio;
        this.canvas.height =
            this.canvas.parentElement!.clientHeight * window.devicePixelRatio;

        this.update();
    }

    reset() {
        this.initialize();
    }

    paint() {
        this.context.fillStyle = 'black';

        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (const node of this.nodes.values()) {
            node.paint();
        }
    }

    #updateNodeSize() {
        this.nodeSize =
            this.canvas.width / this.resolution.x -
            this.borderSize / this.resolution.x -
            this.borderSize;
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
