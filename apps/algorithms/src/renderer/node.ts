import type Renderer from '.';
import { NodeColor } from '../type';

export default class Node {
    renderer: Renderer;
    x: number;
    y: number;
    dx: number;
    dy: number;
    isTarget: boolean;
    isOrigin: boolean;
    isObstruction = false;
    isHighlighted = false;
    isBacktrace = false;
    isVisited = false;
    weight: number | null = null;

    constructor(renderer: Renderer, x: number, y: number, isObstruction: boolean, isTarget: boolean, isOrigin: boolean) {
        this.renderer = renderer;
        this.x = x;
        this.y = y;
        this.isObstruction = isObstruction;
        this.isTarget = isTarget;
        this.isOrigin = isOrigin;

        this.dx = (this.renderer.nodeSize + this.renderer.borderSize) * x + this.renderer.borderSize;
        this.dy =
            (this.renderer.nodeSize + this.renderer.borderSize) * y +
            this.renderer.borderSize;

        this.isVisited = false;
    }

    setOrigin() {
        this.isObstruction = false;
        this.renderer.setOrigin(this);
    }

    setTarget() {
        this.isObstruction = false;
        this.renderer.setTarget(this);
    }

    setVisited() {
        this.isVisited = true;
        this.paint();
    }

    setWeight(weight: number | null) {
        this.weight = weight;
        this.paint();
    }

    setHighlighted(state: boolean) {
        this.isHighlighted = state;
        this.paint();
    }

    setObstruction(state: boolean) {
        if (!this.isOrigin && !this.isTarget) {
            this.isObstruction = state;
        }

        this.paint();
    }

    setBacktrace() {
        this.isBacktrace = true;
        this.paint();
    }

    text(text: string) {
        this.renderer.context.fillStyle = 'white';
        this.renderer.context.strokeStyle = 'black';
        this.renderer.context.lineWidth = 1;

        this.renderer.context.fillText(
            text,
            this.dx + this.renderer.nodeSize / 2 - 1,
            this.dy + this.renderer.nodeSize / 2 + 1
        );

        this.renderer.context.strokeText(
            text,
            this.dx + this.renderer.nodeSize / 2 - 1,
            this.dy + this.renderer.nodeSize / 2 + 1
        );
    }

    paint(color?: string) {
        const ctx = this.renderer.context;

        // paint to background color first to prevent progressive color shift on the edges on repeated color changes
        ctx.fillStyle = 'black';
        ctx.fillRect(
            this.dx - 0.5,
            this.dy - 0.5,
            this.renderer.nodeSize + 1,
            this.renderer.nodeSize + 1
        );

        if (color) {
            ctx.fillStyle = color;
        } else {
            if (this.isHighlighted) {
                ctx.fillStyle = NodeColor.HIGHLIGHT;
            }else if (this.isOrigin) {
                ctx.fillStyle = NodeColor.ORIGIN;
            } else if (this.isTarget) {
                ctx.fillStyle = NodeColor.TARGET;
            } else if (this.isObstruction) {
                ctx.fillStyle = NodeColor.OBSTRUCTION;
            } else if (this.isBacktrace) {
                ctx.fillStyle = NodeColor.BACKTRACE;
            } else if (this.isVisited) {
                ctx.fillStyle = NodeColor.VISITED;
            } else if (this.weight !== null) {
                const r = 255 - this.weight;
                const g = Math.max((128 - this.weight) * 2, 30);
                const b = Math.max((128 - this.weight) * 2, 60);
                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            } else {
                ctx.fillStyle = NodeColor.DEFAULT;
            }
        }

        ctx.fillRect(
            this.dx,
            this.dy,
            this.renderer.nodeSize,
            this.renderer.nodeSize
        );

        if (this.renderer.showNumbers) {
            if (this.x === 0) {
                this.text(this.y.toString());
            }

            if (this.y === 0) {
                this.text(this.x.toString());
            }
        }
    }
}
