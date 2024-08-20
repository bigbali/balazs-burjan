import { useNotificationStore } from 'ui-react19/src/store/useNotificationStore';
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
    isVisited = false;
    weight: number | null = null;
    backtrace: {
        dirX: number;
        dirY: number;
        prevDirX: number;
        prevDirY: number;
    } | null = null;

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

    recalculatePosition() {
        this.dx =
            (this.renderer.nodeSize + this.renderer.borderSize) * this.x +
            this.renderer.borderSize +
            this.renderer.padding.x;
        this.dy =
            (this.renderer.nodeSize + this.renderer.borderSize) * this.y +
            this.renderer.borderSize +
            this.renderer.padding.y;
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

    setBacktrace(value: typeof this.backtrace) {
        this.backtrace = value;
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

    paintVector() {
        const arrowLength = 20;
        const arrowHeadSize = 10;
        const arrowWidth = 4;

        const ctx = this.renderer.context;
        const ns = this.renderer.nodeSize / 2;

        if (ns * 2 < arrowLength) {
            useNotificationStore.getState().pushUniqueNotification({
                title: `Node size is too small (${(ns * 2).toFixed(1)}px) ${Date.now()}`,
                description: 'Node size is too small to render the direction vectors, as you wouldn\'t be able to see them anyway.',
                type: 'error',
                timeout: 10000
            });

            return;
        }

        const {
            dirX,
            prevDirX,
            dirY,
            prevDirY
        } = this.backtrace!;

        // we don't consider endpoints corners, so we check for that too
        const corner = !(dirX === prevDirX && dirY === prevDirY)
            && dirX + dirY !== 0
            && prevDirX + prevDirY !== 0;

        // previous directions align with the directions we are drawing our corner arrow to
        const cornerDirX = prevDirX;
        const cornerDirY = prevDirY;

        if (corner) {
            const angleFirstSegment = Math.atan2(dirY, dirX);

            const firstSegmentTipX =
                this.dx +
                Math.cos(angleFirstSegment) * arrowLength +
                ns -
                (arrowLength / 2 + arrowHeadSize) * dirX;
            const firstSegmentTipY =
                this.dy +
                Math.sin(angleFirstSegment) * arrowLength +
                ns -
                (arrowLength / 2 + arrowHeadSize) * dirY;

            ctx.strokeStyle = 'white';
            ctx.lineWidth = arrowWidth;

            // draw the arrow shaft first segment
            ctx.beginPath();
            ctx.moveTo(
                this.dx + ns - (arrowLength / 1.5 * dirX),
                this.dy + ns - (arrowLength / 1.5 * dirY)
            );
            ctx.lineTo(firstSegmentTipX, firstSegmentTipY);
            ctx.stroke();

            const angleSecondSegment = Math.atan2(prevDirY, prevDirX);

            const secondSegmentStartX = firstSegmentTipX - arrowWidth / 2 * cornerDirX;
            const secondSegmentStartY = firstSegmentTipY - arrowWidth / 2 * cornerDirY;

            const secondSegmentTipX =
                secondSegmentStartX +
                (arrowLength / 2) * cornerDirX;
            const secondSegmentTipY =
                secondSegmentStartY +
                (arrowLength / 2) * cornerDirY;

            // draw the arrow shaft second segment
            ctx.beginPath();
            ctx.moveTo(secondSegmentStartX, secondSegmentStartY);
            ctx.lineTo(secondSegmentTipX, secondSegmentTipY);
            ctx.stroke();

            const leftHeadX =
                secondSegmentTipX +
                10 * prevDirX -
                Math.cos(angleSecondSegment - Math.PI / 6) * arrowHeadSize;
            const leftHeadY =
                secondSegmentTipY +
                10 * prevDirY -
                Math.sin(angleSecondSegment - Math.PI / 6) * arrowHeadSize;

            const rightHeadX =
                secondSegmentTipX +
                10 * prevDirX -
                Math.cos(angleSecondSegment + Math.PI / 6) * arrowHeadSize;
            const rightHeadY =
                secondSegmentTipY +
                10 * prevDirY -
                Math.sin(angleSecondSegment + Math.PI / 6) * arrowHeadSize;

            // draw the arrow head
            ctx.beginPath();
            ctx.moveTo(secondSegmentTipX, secondSegmentTipY);
            ctx.lineTo(leftHeadX, leftHeadY);
            ctx.lineTo(
                secondSegmentTipX + arrowHeadSize * prevDirX,
                secondSegmentTipY + arrowHeadSize * prevDirY
            );
            ctx.lineTo(rightHeadX, rightHeadY);
            ctx.fillStyle = 'white';
            ctx.fill();

            // --- debug ---

            // const ds = 4;
            // const doff = ds / 2;

            // ctx.fillStyle = 'green';
            // ctx.fillRect(secondSegmentStartX - doff, secondSegmentStartY - doff, ds, ds);

            // ctx.fillStyle = 'red';
            // ctx.fillRect(secondSegmentTipX - doff, secondSegmentTipY - doff, ds, ds);

            // // first segment tip
            // ctx.fillStyle = 'black';
            // ctx.fillRect(arrowTipX, arrowTipY, 3, 3);

            // // second segment tip
            // ctx.fillStyle = 'black';
            // ctx.fillRect(secondSegmentTipX, secondSegmentTipY, 3, 3);

            // // left
            // ctx.fillStyle = 'green';
            // ctx.fillRect(leftHeadX, leftHeadY, 6, 6);

            // // right too low
            // ctx.fillStyle = 'red';
            // ctx.fillRect(rightHeadX, rightHeadY, 6, 6);

            // // tip ok
            // ctx.fillStyle = 'blue';
            // ctx.fillRect(
            //     secondSegmentTipX + arrowHeadSize * prevDirX,
            //     secondSegmentTipY + arrowHeadSize * prevDirY,
            //     6,
            //     6
            // );
        } else {
            const angle = Math.atan2(dirY, dirX);

            const arrowTipX =
                this.dx +
                Math.cos(angle) * arrowLength +
                ns -
                (arrowLength / 2 + arrowHeadSize) * dirX;
            const arrowTipY =
                this.dy +
                Math.sin(angle) * arrowLength +
                ns -
                (arrowLength / 2 + arrowHeadSize) * dirY;

            const leftHeadX =
                arrowTipX + (10 * dirX) - Math.cos(angle - Math.PI / 6) * arrowHeadSize;
            const leftHeadY =
                arrowTipY  + (10 * dirY)- Math.sin(angle - Math.PI / 6) * arrowHeadSize;

            const rightHeadX =
                arrowTipX +
                (10 * dirX) -
                Math.cos(angle + Math.PI / 6) * arrowHeadSize;
            const rightHeadY =
                arrowTipY +
                (10 * dirY) -
                Math.sin(angle + Math.PI / 6) * arrowHeadSize;

            ctx.strokeStyle = 'white';
            ctx.lineWidth = arrowWidth;

            // draw the arrow shaft
            ctx.beginPath();
            ctx.moveTo(
                this.dx + ns - (arrowLength / 2) * dirX,
                this.dy + ns - (arrowLength / 2) * dirY
            );
            ctx.lineTo(arrowTipX, arrowTipY);
            ctx.stroke();

            // draw the arrow head
            ctx.beginPath();
            ctx.moveTo(arrowTipX, arrowTipY);
            ctx.lineTo(leftHeadX, leftHeadY);
            ctx.lineTo(
                arrowTipX + arrowHeadSize * dirX,
                arrowTipY + arrowHeadSize * dirY
            );
            ctx.lineTo(rightHeadX, rightHeadY);
            ctx.fillStyle = 'white';
            ctx.fill();

            // // left
            // ctx.fillStyle = 'green';
            // ctx.fillRect(leftHeadX, leftHeadY, 3, 3);

            // // right
            // ctx.fillStyle = 'red';
            // ctx.fillRect(rightHeadX, rightHeadY, 3, 3);

            // // tip
            // ctx.fillStyle = 'white';
            // ctx.fillRect(
            //     arrowTipX + arrowHeadSize * dirx,
            //     arrowTipY + arrowHeadSize * diry,
            //     3,
            //     3
            // );
        }
    }

    paint(colorOverride?: string) {
        const ctx = this.renderer.context;

        // paint to background color first to prevent progressive color shift on the edges on repeated color changes
        ctx.fillStyle = 'black';
        ctx.fillRect(
            this.dx - 0.5,
            this.dy - 0.5,
            this.renderer.nodeSize + 1,
            this.renderer.nodeSize + 1
        );

        if (colorOverride) {
            ctx.fillStyle = colorOverride;
        } else {
            if (this.isHighlighted) {
                ctx.fillStyle = NodeColor.HIGHLIGHT;
            } else if (this.isOrigin) {
                ctx.fillStyle = NodeColor.ORIGIN;
            } else if (this.isTarget) {
                ctx.fillStyle = NodeColor.TARGET;
            } else if (this.isObstruction) {
                ctx.fillStyle = NodeColor.OBSTRUCTION;
            } else if (this.backtrace) {
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

        if (this.backtrace && this.renderer.showTraceVectors) {
            this.paintVector();
        }

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
