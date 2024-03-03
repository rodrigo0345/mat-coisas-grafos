export class Node {
    constructor(x, y, weight, element) {
        this.isDisabled = false;
        this.x = x;
        this.y = y;
        this.weight = weight;
        this.element = element;
    }
    static Node(node1, node2) {
        return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
    }
    disableNode() {
        this.isDisabled = true;
    }
    activateNode() {
        this.isDisabled = false;
    }
    toggleObstacleClass() {
        if (this.element.classList.contains("obs-class")) {
            this.element.classList.remove("obs-class");
            this.activateNode();
        }
        else {
            this.element.classList.add("obs-class");
            this.disableNode();
        }
    }
    toggleStartPointClass() {
        if (this.element.classList.contains("pc-class")) {
            this.element.classList.remove("pc-class");
        }
        else {
            this.element.classList.add("pc-class");
        }
    }
    toggleEndpointClass() {
        if (this.element.classList.contains("pi-class")) {
            this.element.classList.remove("pi-class");
        }
        else {
            this.element.classList.add("pi-class");
        }
    }
    approximateDistance(node) {
        return Math.abs(this.x - node.x) + Math.abs(this.y - node.y);
    }
}
