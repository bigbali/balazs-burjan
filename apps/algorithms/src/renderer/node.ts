import type Canvas from './canvas';

export default class Node {
    renderer: Canvas;
    x: number;
    y: number;
    dx: number;
    dy: number;
    // sdx: number;
    // sdy: number;
    size: number;
    borderSize: number;
    isObstruction: boolean;
    isTarget: boolean;
    isOrigin: boolean;

    constructor(renderer: Canvas, x: number, y: number, size: number, isObstruction: boolean, isTarget: boolean, isOrigin: boolean) {
        this.renderer = renderer;
        this.x = x;
        this.y = y;
        this.isObstruction = isObstruction;
        this.isTarget = isTarget;
        this.isOrigin = isOrigin;

        this.borderSize = 3;
        this.size = size;
        this.dx = (size + this.borderSize) * x + this.borderSize;
        this.dy = (size + this.borderSize) * y + this.borderSize;
    }

    paint() {
        const ctx = this.renderer.context;

        ctx.fillStyle = 'red';
        ctx.fillRect(this.dx, this.dy, this.size, this.size);

        console.log(this);

        if (this.renderer.showNumbers) {
            if (this.x === 0) {
                ctx.font = `${this.size * 0.6}px monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = 'white';
                ctx.fillText(
                    this.y.toString(),
                    this.dx + this.size / 2 - 1,
                    this.dy + this.size / 2 + 1
                );
            }

            if (this.y === 0) {
                ctx.font = `${this.size * 0.6}px monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = 'white';
                ctx.fillText(
                    this.x.toString(),
                    this.dx + this.size / 2 - 1,
                    this.dy + this.size / 2 + 1
                );
            }
        }
    }
}
