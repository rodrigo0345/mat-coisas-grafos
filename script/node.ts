export class Node {
  x;
  y;
  weight;
  element;

  constructor(x: number, y: number, weight: number, element: HTMLElement) {
    this.x = x;
    this.y = y;
    this.weight = weight;
    this.element = element;
  }
}
