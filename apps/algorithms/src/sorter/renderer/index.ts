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
    swap: number[] = [];
    noSwap: number[] = [];

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

    highlightSwap(...indexes: number[]) {
        this.swap = [...indexes];
    }

    highlightNoSwap(...indexes: number[]) {
        this.noSwap = [...indexes];
    }

    draw(values: number[]) {
        this.values = values;

        if (values.length === 0) {
            return;
        }

        const maxHeight = this.canvas.height * this.scaling - this.padding.y * 2;
        const width = 20;
        // const d = this.canvas.width / ((this.values.length + 1) * width) * this.values.length;
        // const d = ((this.canvas.width /* - this.padding.x * 2 */) - ((this.values.length) * width)) / (this.values.length + 1);

        const columnsWidth = width * this.values.length;
        const availableWidth = this.canvas.width - columnsWidth;
        const d = availableWidth / (this.values.length + 1);

        const min = this.values.reduce((prev, cur) => {
            if (prev) {
                if (cur < prev) return cur;
                return prev;
            } else {
                return cur;
            }
        }, this.values[0]!);

        const max = this.values.reduce((prev, cur) => {
            if (prev) {
                if (cur > prev) return cur;
                return prev;
            } else {
                return cur;
            }
        }, this.values[0]!);


        this.context.font = `${24 * this.scaling}px monospace`;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';

        this.context.fillStyle = 'black';

        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        let i = 0;
        for (const value of this.values) {
            const h = value / max * maxHeight;
            const x = (i + 1) * d + i * width;
            // const origoY = min < 0 ? this.canvas.height / 2 : this.canvas.height - this.padding.y - h;
            const origoY = this.canvas.height - this.padding.y - h;



            this.context.fillStyle = 'blue';
            this.context.fillRect(x, origoY, width, h - 64);

            if (this.swap.includes(i)) {
                this.context.lineWidth = 6;
                this.context.strokeStyle = 'yellow';
                this.context.strokeRect(x - 2, origoY, width + 4, h - 64 + 2);
            }

            if (this.noSwap.includes(i)) {
                this.context.lineWidth = 6;
                this.context.strokeStyle = 'green';
                this.context.strokeRect(x - 2, origoY, width + 4, h - 64 + 2);
            }

            this.context.fillStyle = 'pink';
            this.context.fillText(value.toString(), x + width / 2, this.canvas.height - 32);
            i++;
        }

        this.swap = [];
        this.noSwap = [];
    }

    resize() {
        this.canvas.width =
            this.canvas.parentElement!.clientWidth * window.devicePixelRatio;
        this.canvas.height =
            this.canvas.parentElement!.clientHeight * window.devicePixelRatio;
    }

    reset() {
        // usePathfinderStore.getState().setResult(null);

        // reset algorithm cache
        // this.update();
    }

    paint() {
        // this.context.fillStyle = 'black';

        // this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // for (const node of this.nodes.values()) {
        //     node.paint();
        // }
    }
}
