import type { Coordinate } from '../../../../util/common';

export type DijkstraQueueEntry = Coordinate & {
    weight: number | null,
    parent: DijkstraQueueEntry | null
};

export class PriorityQueue {
    // constructor(initial: DijkstraQueueEntry[]) {
    //     this.queue = initial;
    // }

    private heap: [number, DijkstraQueueEntry][] = [];

    push(priority: number, value: DijkstraQueueEntry): void {
        this.heap.push([priority, value]);
        this.bubbleUp(this.heap.length - 1);
    }

    pop(): [number, DijkstraQueueEntry] | undefined {
        const result = this.heap[0];
        const last = this.heap.pop();

        if (this.heap.length > 0 && last) {
            this.heap[0] = last;
            this.bubbleDown(0);
        }

        return [result![0], result![1]];
    }

    isEmpty(): boolean {
        return this.heap.length === 0;
    }

    private bubbleUp(index: number): void {
        const [priority, value] = this.heap[index]!;

        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[parentIndex]![0] <= priority) {
                break;
            }

            this.heap[index] = this.heap[parentIndex]!;
            index = parentIndex;
        }

        this.heap[index] = [priority, value];
    }

    private bubbleDown(index: number): void {
        const [priority, value] = this.heap[index]!;
        const lastIndex = this.heap.length - 1;

        while (true) {
            const leftChildIndex = 2 * index + 1;
            const rightChildIndex = 2 * index + 2;

            if (leftChildIndex > lastIndex) {
                break;
            }

            let smallerChildIndex = leftChildIndex;

            if (
                rightChildIndex <= lastIndex &&
                this.heap[rightChildIndex]![0] < this.heap[leftChildIndex]![0]
            ) {
                smallerChildIndex = rightChildIndex;
            }

            if (this.heap[smallerChildIndex]![0] >= priority) {
                break;
            }

            // @ts-ignore
            this.heap[index] = this.heap[smallerChildIndex];
            index = smallerChildIndex;
        }

        this.heap[index] = [priority, value];
    }
}
