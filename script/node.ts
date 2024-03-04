export class Node {
  x;
  y;
  weight;
  element;
  isDisabled = false;
  isHiddenText = false;

  constructor(x: number, y: number, weight: number, element: HTMLElement) {
    this.x = x;
    this.y = y;
    this.weight = weight;
    this.element = element;
  }

  static Node(node1: Node, node2: Node) {
    return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
  }

  disableNode() {
    this.isDisabled = true;
  }
  activateNode() {
    this.isDisabled = false;
  }

  toggleHideText() {
    if (this.isHiddenText) {
      this.isHiddenText = false;
      this.element.textContent = this.weight.toString();
      return;
    }

    this.isHiddenText = true;
    this.element.textContent = "";
  }

  toggleObstacleClass() {
    if (this.element.classList.contains("obs-class")) {
      this.element.classList.remove("obs-class");
      this.activateNode();
    } else {
      this.element.classList.add("obs-class");
      this.disableNode();
    }
  }

  toggleStartPointClass() {
    if (this.element.classList.contains("pc-class")) {
      this.element.classList.remove("pc-class");
    } else {
      this.element.classList.add("pc-class");
    }
  }

  toggleEndpointClass() {
    if (this.element.classList.contains("pi-class")) {
      this.element.classList.remove("pi-class");
    } else {
      this.element.classList.add("pi-class");
    }
  }

  getDistance(node: Node) {
    return Math.abs(this.x - node.x) + Math.abs(this.y - node.y) + this.weight;
  }
}
