import type Canvas from './canvas';

export default class Node {
    renderer: Canvas;
    x: number;
    y: number;
    dx: number;
    dy: number;
    isObstruction: boolean;
    isTarget: boolean;
    isOrigin: boolean;
    isVisited: boolean;
    weight = 0;

    constructor(renderer: Canvas, x: number, y: number, isObstruction: boolean, isTarget: boolean, isOrigin: boolean) {
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
        this.renderer.setOrigin(this);
    }

    setTarget() {
        this.renderer.setTarget(this);
    }

    paint(color?: string) {
        const ctx = this.renderer.context;

        ctx.fillStyle = 'red';

        // console.log('paint');

        if (this.isOrigin) {
            ctx.fillStyle = 'dodgerblue';
        }

        if (this.isTarget) {
            ctx.fillStyle = 'green';
        }

        if (color) {
            ctx.fillStyle = color;
            // console.log('yooo', this);
        }

        ctx.fillRect(
            this.dx,
            this.dy,
            this.renderer.nodeSize,
            this.renderer.nodeSize
        );

        if (this.renderer.showNumbers) {
            if (this.x === 0) {
                ctx.font = `${this.renderer.nodeSize * 0.6}px monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = 'white';
                ctx.fillText(
                    this.y.toString(),
                    this.dx + this.renderer.nodeSize / 2 - 1,
                    this.dy + this.renderer.nodeSize / 2 + 1
                );
            }

            if (this.y === 0) {
                ctx.font = `${this.renderer.nodeSize * 0.6}px monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = 'white';
                ctx.fillText(
                    this.x.toString(),
                    this.dx + this.renderer.nodeSize / 2 - 1,
                    this.dy + this.renderer.nodeSize / 2 + 1
                );
            }
        }
    }
}
