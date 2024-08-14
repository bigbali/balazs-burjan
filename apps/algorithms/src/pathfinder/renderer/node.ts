import type PathfinderRenderer from '.';
import { NodeColor } from '../../type';

export default class PathfinderNode {
    renderer: PathfinderRenderer;
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

    constructor(renderer: PathfinderRenderer, x: number, y: number, isObstruction: boolean, isTarget: boolean, isOrigin: boolean) {
        this.renderer = renderer;
        this.x = x;
        this.y = y;
        this.isObstruction = isObstruction;
        this.isTarget = isTarget;
        this.isOrigin = isOrigin;

        this.dx = (this.renderer.nodeSize + this.renderer.borderSize) * x + this.renderer.borderSize + this.renderer.padding.x;
        this.dy =
            (this.renderer.nodeSize + this.renderer.borderSize) * y +
            this.renderer.borderSize + this.renderer.padding.y;

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

    setVisited(state?: boolean) {
        if (state === false) {
            this.isVisited = false;
        } else {
            this.isVisited = true;
        }

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

    paintVector(prevNode: PathfinderNode) {
        const ctx = this.renderer.context;

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;

        const dirx = this.x - prevNode.x; // Direction -1, 0, 1
        const diry = this.y - prevNode.y; // Direction -1, 0, 1
        const dx = this.dx - prevNode.dx; // Distance between nodes
        const dy = this.dy - prevNode.dy; // Distance between
        const arrowLength = 20; // Length of the arrow
        const arrowHeadSize = 10; // Size of the arrowhead

        // incorrect detection of corner

        if (this.x === 21 && this.y === 0) {
            console.log(dirx, diry);
        }
        if (this.x === 21 && this.y === 1) {
            console.log(dirx, diry);
        }

        // ctx.beginPath();

        // const dirx = this.dx - prevNode.dx;
        // const diry = this.dy - prevNode.dy;

        if (dirx !== 0 && diry !== 0) {
            console.log('corner at', this.x, this.y);
            const firstSegmentX = this.dx + dirx * arrowLength;
            const firstSegmentY = this.dy;

            // Determine the second segment direction
            const secondSegmentX = firstSegmentX + dx;
            const secondSegmentY = firstSegmentY + dy;

            // Draw the first segment
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.dx, this.dy);
            ctx.lineTo(firstSegmentX, firstSegmentY);
            ctx.stroke();

            ctx.strokeStyle = 'blue';

            // Draw the second segment
            ctx.beginPath();
            ctx.moveTo(firstSegmentX, firstSegmentY);
            ctx.lineTo(secondSegmentX, secondSegmentY);
            ctx.stroke();

            // Calculate arrowhead points for the second segment
            const angle = Math.atan2(diry, 0); // angle based on vertical direction
            const arrowTipX = secondSegmentX;
            const arrowTipY = secondSegmentY;

            const leftHeadX = arrowTipX - Math.cos(angle - Math.PI / 6) * arrowHeadSize;
            const leftHeadY = arrowTipY - Math.sin(angle - Math.PI / 6) * arrowHeadSize;

            const rightHeadX = arrowTipX - Math.cos(angle + Math.PI / 6) * arrowHeadSize;
            const rightHeadY = arrowTipY - Math.sin(angle + Math.PI / 6) * arrowHeadSize;

            // Draw the arrowhead at the end of the second segment
            ctx.beginPath();
            ctx.moveTo(arrowTipX, arrowTipY);
            ctx.lineTo(leftHeadX, leftHeadY);
            ctx.lineTo(rightHeadX, rightHeadY);
            ctx.lineTo(arrowTipX, arrowTipY);
            ctx.fillStyle = 'black';
            ctx.fill();
        } else {


            // if (dirx !== 0) {
            //     ctx.moveTo(prevNode.dx + this.renderer.nodeSize / 2, prevNode.dy + this.renderer.nodeSize / 2);
            //     ctx.lineTo(this.dx + this.renderer.nodeSize / 2, this.dy + this.renderer.nodeSize / 2);

            // }
            // if (diry !== 0) {

            // }
            // ctx.moveTo(prevNode.dx + this.renderer.nodeSize / 2, prevNode.dy + this.renderer.nodeSize / 2);
            // ctx.lineTo(prevNode.dx + this.renderer.nodeSize / 2 + 20, prevNode.dy +this.renderer.nodeSize / 2 + 20);
            // ctx.lineTo(prevNode.dx + this.renderer.nodeSize / 2 - 20, prevNode.dy + this.renderer.nodeSize / 2 - 20);

            // const arrowCorner1 = [this.dx + dirx, this.dy + diry] as const;
            // const arrowCorner2 = [this.dx + this.renderer.nodeSize / 2 + 20, this.dy +this.renderer.nodeSize / 2 + 20] as const;
            // const arrowCorner3 = [this.dx + this.renderer.nodeSize / 2 - 20, this.dy + this.renderer.nodeSize / 2 - 20] as const;

            // ctx.fillStyle = 'red';
            // ctx.fillRect(...arrowCorner1, 5, 5);

            // ctx.fillStyle = 'green';
            // ctx.fillRect(...arrowCorner2, 5, 5);

            // ctx.fillStyle = 'blue';
            // ctx.fillRect(...arrowCorner3, 5, 5);

            // console.log(arrowCorner1, arrowCorner2, arrowCorner3);

            // ctx.fill();


            // Calculate the angle based on direction
            const angle = Math.atan2(diry, dirx);
            const ns = this.renderer.nodeSize / 2;

            // Calculate the arrow tip point
            const arrowTipX = this.dx + Math.cos(angle) * arrowLength;
            const arrowTipY = this.dy + Math.sin(angle) * arrowLength;

            // Calculate arrowhead points
            const leftHeadX = arrowTipX - Math.cos(angle - Math.PI / 6) * arrowHeadSize;
            const leftHeadY = arrowTipY - Math.sin(angle - Math.PI / 6) * arrowHeadSize;

            const rightHeadX = arrowTipX - Math.cos(angle + Math.PI / 6) * arrowHeadSize;
            const rightHeadY = arrowTipY - Math.sin(angle + Math.PI / 6) * arrowHeadSize;

            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;

            // console.log(prevNode.x, prevNode.y, prevNode.dx, prevNode.dy);


            // Draw the arrow shaft
            ctx.beginPath();
            ctx.moveTo(this.dx + ns, this.dy + ns);
            ctx.lineTo(arrowTipX + ns, arrowTipY + ns);
            ctx.stroke();

            // Draw the arrowhead
            ctx.beginPath();
            ctx.moveTo(arrowTipX  + ns, arrowTipY + ns);
            ctx.lineTo(leftHeadX + ns, leftHeadY + ns);
            ctx.lineTo(rightHeadX + ns, rightHeadY + ns);
            ctx.lineTo(arrowTipX + ns, arrowTipY + ns);
            ctx.fillStyle = 'black';
            ctx.fill();
        }
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
            } else if (this.isOrigin) {
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
