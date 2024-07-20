import { NodeColor, SorterColor, type Resolution } from '../../type';

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
    highlighted: number[] = [];

    constructor(canvas: HTMLCanvasElement, values: number[]) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d')!;

        this.canvas.width =
            canvas.parentElement!.clientWidth * window.devicePixelRatio;
        this.canvas.height =
            canvas.parentElement!.clientHeight * window.devicePixelRatio;

        this.draw(values);

        this.context.lineWidth = 6;

        canvas.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        });
    }

    resize() {
        this.canvas.width =
            this.canvas.parentElement!.clientWidth * window.devicePixelRatio;
        this.canvas.height =
            this.canvas.parentElement!.clientHeight * window.devicePixelRatio;

        this.draw(this.values);
    }

    highlightSwap(...indexes: number[]) {
        this.swap = [...indexes];
    }

    highlightNoSwap(...indexes: number[]) {
        this.noSwap = [...indexes];
    }

    highlight(...indexes: number[]) {
        this.highlighted = [...indexes];
    }

    setScaling(scaling: number) {
        this.scaling = scaling;
        this.draw(this.values, true);
    }

    draw(values: number[], keepHighlighted?: boolean) {
        this.values = values;

        if (values.length === 0) {
            return;
        }

        const maxHeight = (this.canvas.height - this.padding.y * 2) * this.scaling;
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

            this.context.fillStyle = SorterColor.DEFAULT;
            this.context.fillRect(x, origoY, width, h);

            const strokeX = x - 3;
            const strokeWidth =  width + 6;
            const strokeHeight = h > 0 ? h + 3 : h - 3;

            if (this.swap.includes(i)) {
                this.context.strokeStyle = SorterColor.SWAP;
                this.context.strokeRect(strokeX, origoY, strokeWidth, strokeHeight);
            }

            if (this.noSwap.includes(i)) {
                this.context.strokeStyle = SorterColor.UNCHANGED;
                this.context.strokeRect(strokeX, origoY, strokeWidth, strokeHeight);
            }

            if (this.highlighted.includes(i)) {
                this.context.strokeStyle = SorterColor.HIGHLIGHT;
                this.context.strokeRect(strokeX, origoY, strokeWidth, strokeHeight);
            }

            this.context.fillStyle = NodeColor.TARGET;
            this.context.fillText(value.toString(), x + width / 2, this.canvas.height - this.padding.y / 2);
            i++;
        }

        if (keepHighlighted) {
            return;
        }

        this.swap = [];
        this.noSwap = [];
        this.highlighted = [];
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
