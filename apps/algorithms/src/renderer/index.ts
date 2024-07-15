import type { Resolution } from '../type';
import { Dimensions } from '../type';
import Node from './node';
import usePathfinderStore from './usePathfinderStore';

export default class Renderer {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    nodes: Map<string, Node>;
    resolution: Resolution;
    origin!: Node;
    target!: Node;
    nodeSize!: number;
    showNumbers = true;
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
        this.#ensureContainment(true);

        for (let x = 0; x < this.resolution.x; x++) {
            for (let y = 0; y < this.resolution.y; y++) {
                const isOrigin = x === 0 && y === 0;
                const isTarget = x === this.resolution.x - 1 && y === this.resolution.y - 1;

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

        this.#ensureContainment();

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
        usePathfinderStore.getState().setResult(null);

        // reset algorithm cache
        this.update();
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
