// import { generatorRunner } from '../../util';

// class MinHeap{
//     private heap: number[] = [];

//     add(element: number) {
//         this.heap.push(element);
//         this.heapifyUp();
//     }

//     poll(): number {
//         const minElement = this.heap[0];
//         this.heap[0] = this.heap.pop()!;
//         this.heapifyDown();
//         return minElement;
//     }

//     isEmpty() {
//         return this.heap.length === 0;
//     }

//     private heapifyUp() {
//         const element = this.heap[0];
//         let currentIndex = 0;
//         let parentIndex = Math.floor((currentIndex - 1) / 2);

//         while (currentIndex > 0 && this.heap[parentIndex] > element) {
//             this.heap[currentIndex] = this.heap[parentIndex];
//             currentIndex = parentIndex;
//             parentIndex = Math.floor((currentIndex - 1) / 2);
//         }

//         this.heap[currentIndex] = element;
//     }

//     private heapifyDown() {
//         const element = this.heap[0];
//         let currentIndex = 0;
//         let leftChildIndex = 2 * currentIndex + 1;
//         let rightChildIndex = 2 * currentIndex + 2;
//         let minIndex = currentIndex;

//         while (leftChildIndex < this.heap.length) {
//             if (this.heap[leftChildIndex] < this.heap[minIndex]) {
//                 minIndex = leftChildIndex;
//             }

//             if (rightChildIndex < this.heap.length && this.heap[rightChildIndex] < this.heap[minIndex]) {
//                 minIndex = rightChildIndex;
//             }

//             if (minIndex === currentIndex) {
//                 break;
//             }

//             this.heap[currentIndex] = this.heap[minIndex];
//             currentIndex = minIndex;
//             leftChildIndex = 2 * currentIndex + 1;

//             rightChildIndex = 2 * currentIndex + 2;
//         }

//     }
// }

// export default class HeapSort {
//     static begin(values: number[]) {
//         return generatorRunner(this.run(values));
//     }

//     static *run(values: number[]) {
//         const sortedArray = [];
//         yield;
//         // const minHeap = new MinHeap(this.callbacks.compareCallback);

//         // Insert all array elements to the heap.
//         // originalArray.forEach((element) => {
//         //     // Call visiting callback.
//         //     this.callbacks.visitingCallback(element);

//         //     minHeap.add(element);
//         // });

//         // // Now we have min heap with minimal element always on top.
//         // // Let's poll that minimal element one by one and thus form the sorted array.
//         // while (!minHeap.isEmpty()) {
//         //     const nextMinElement = minHeap.poll();

//         //     // Call visiting callback.
//         //     this.callbacks.visitingCallback(nextMinElement);

//         //     sortedArray.push(nextMinElement);

//         //     yield;
//         // }

//         // return sortedArray;

//     }
// }