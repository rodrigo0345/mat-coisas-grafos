export class Node {
    constructor(x, y, weight, element) {
        this.isDisabled = false;
        this.isHiddenText = false;
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
    toggleSearchClass() {
        if (this.element.classList.contains("search-class")) {
            this.element.classList.remove("search-class");
        }
        else {
            this.element.classList.add("search-class");
        }
    }
    enableDebugClass() {
        if (!this.element.classList.contains("debug-class"))
            this.element.classList.add("debug-class");
    }
    enablePath() {
        this.element.classList.add("path-class");
    }
    getDistance(node) {
        return Math.abs(this.x - node.x) + Math.abs(this.y - node.y);
    }
    equals(node) {
        return this.x === node.x && this.y === node.y;
    }
}
