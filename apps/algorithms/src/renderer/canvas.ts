import Node from './node';

type Resolution = {
    x: number,
    y: number
};

export default class Canvas {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    nodes: Node[];
    showNumbers = true;
    // resolution: Resolution;
    // dx: number;
    // dy: number;

    constructor(canvas: HTMLCanvasElement, resolution: Resolution) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d')!;
        this.nodes = [];

        this.canvas.width =
            canvas.parentElement!.clientWidth * window.devicePixelRatio;
        this.canvas.height =
            canvas.parentElement!.clientHeight * window.devicePixelRatio;


        for (let x = 0; x < resolution.x; x++) {
            for (let y = 0; y < resolution.y; y++) {
                let s =
                    this.canvas.width / resolution.x - (3 / resolution.x) - 3;

                this.nodes.push(new Node(this, x, y, s, false, false, false));
            }
        }

        this.firstPaint();
    }

    firstPaint() {
        this.context.fillStyle = 'black';

        this.context.fillRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        for (const node of this.nodes) {
            node.paint();
        }
    }

    setShowNumbers(value: boolean) {
        this.showNumbers = value;
        this.firstPaint();
    }
}
