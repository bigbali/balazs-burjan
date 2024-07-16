import type { Resolution } from '../../type';

export default class SorterRenderer {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    values!: number[];
    scaling = 1;
    showNumbers = true;
    padding: Resolution = {
        x: 20,
        y: 20
    };

    constructor(canvas: HTMLCanvasElement, values: number[]) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d')!;

        this.canvas.width =
            canvas.parentElement!.clientWidth * window.devicePixelRatio;
        this.canvas.height =
            canvas.parentElement!.clientHeight * window.devicePixelRatio;

        this.draw(values);

        canvas.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        });
    }

    draw(values: number[]) {
        this.values = values;
        const maxHeight = this.canvas.height * this.scaling - this.padding.y * 2;
        const width = 20;
        // const d = this.canvas.width / ((this.values.length + 1) * width) * this.values.length;
        const d = ((this.canvas.width - this.padding.x * 2) - ((this.values.length) * width)) / this.values.length;

        const maxval = this.values.reduce((prev, cur) => {
            if (prev) {
                if (cur > prev) return cur;
                return prev;
            } else {
                return cur;
            }
        }, this.values[0]);
        const minval = this.values.reduce((prev, cur) => {
            if (prev) {
                if (cur < prev) return cur;
                return prev;
            } else {
                return cur;
            }
        }, this.values[0]);

        this.context.fillStyle = 'black';

        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        let i = 1;
        for (const value of this.values) {
            const h = value / maxval! * maxHeight;

            console.log(i*d, width, h);

            this.context.fillStyle = 'blue';

            this.context.fillRect(i * d + this.padding.x, this.canvas.height - this.padding.y - h, width, h);

            i++;
        }

        this.context.font = `${0.6}px monospace`;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';

        this.paint();
    }

    update() {
        // for (let x = 0; x < this.resolution.x; x++) {
        //     for (let y = 0; y < this.resolution.y; y++) {
        //         const isOrigin = x === this.origin.x && y === this.origin.y;
        //         const isTarget = x === this.target.x && y === this.target.y;

        //         const node = new SorterNode(this, x, y, false, isTarget, isOrigin);

        //         this.nodes.set(`${x},${y}`, node);
        //     }
        // }

        // this.context.font = `${this.nodeSize * 0.6}px monospace`;
        // this.context.textAlign = 'center';
        // this.context.textBaseline = 'middle';


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
        // usePathfinderStore.getState().setResult(null);

        // reset algorithm cache
        this.update();
    }

    paint() {
        // this.context.fillStyle = 'black';

        // this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // for (const node of this.nodes.values()) {
        //     node.paint();
        // }
    }
}
