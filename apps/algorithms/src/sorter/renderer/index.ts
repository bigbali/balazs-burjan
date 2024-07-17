import { NodeColor, type Resolution } from '../../type';

export default class SorterRenderer {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    values!: number[];
    scaling = 1;
    showNumbers = true;
    padding: Resolution = {
        x: 20,
        y: 64
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

        this.context.fillStyle = NodeColor.DEFAULT;

        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        let i = 0;
        for (const value of this.values) {
            const x = (i + 1) * d + i * width;
            const centerY = min < 0;
            const origoY = centerY ? this.canvas.height / 2 : this.canvas.height - this.padding.y;

            let h = 0;
            if (Math.abs(min) > max) {
                h = centerY ? ((value / Math.abs(min)) * maxHeight * -1) / 2 : (value / Math.abs(min)) * maxHeight * -1;
            } else {
                h = centerY ? ((value / max) * maxHeight * -1) / 2 : (value / max) * maxHeight * -1;
            }

            this.context.fillStyle = NodeColor.TARGET;
            this.context.fillRect(x, origoY, width, h);

            if (this.swap.includes(i)) {
                this.context.lineWidth = 6;
                this.context.strokeStyle = NodeColor.BACKTRACE;
                this.context.strokeRect(x - 3, origoY, width + 6, h > 0 ? h + 3 : h - 3);
            }

            if (this.noSwap.includes(i)) {
                this.context.lineWidth = 6;
                this.context.strokeStyle = NodeColor.HIGHLIGHT;
                this.context.strokeRect(x - 2, origoY, width + 4, h > 0 ? h + 3 : h - 3);
            }

            this.context.fillStyle = NodeColor.TARGET;
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
