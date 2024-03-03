import { AStar } from "./aStart.js";
import { Node } from "./node.js";
var NodeStateEnum;
(function (NodeStateEnum) {
    NodeStateEnum["START_POINT"] = "pc";
    NodeStateEnum["OBS_POINT"] = "obs";
    NodeStateEnum["POINT_OF_INTEREST"] = "pi";
})(NodeStateEnum || (NodeStateEnum = {}));
export class Frontend {
    constructor(selectedList, gridContainer, window) {
        this._allPoints = [];
        this._pointsOfInterest = [];
        this._obstaclePoints = [];
        this._startPoint = null;
        this._gridContainer = null;
        this._gridSize = 7;
        this._enabledType = NodeStateEnum.OBS_POINT;
        this._selectedList = selectedList;
        this._gridContainer = gridContainer;
        this._window = window;
    }
    generateGrid() {
        var _a, _b;
        (_a = this._gridContainer) === null || _a === void 0 ? void 0 : _a.style.setProperty("grid-template-columns", `repeat(${this._gridSize}, 1fr)`);
        for (let x = 0; x < this._gridSize; x++) {
            for (let y = 0; y < this._gridSize; y++) {
                const weight = Math.floor(Math.random() * 8) + 1; // Random weight from 1 to 10
                const gridItem = document.createElement("div");
                gridItem.classList.add("grid-item");
                gridItem.setAttribute("data-x", x.toString());
                gridItem.setAttribute("data-y", y.toString());
                gridItem.setAttribute("data-weight", weight.toString());
                gridItem.textContent = weight.toString();
                this._allPoints.push(new Node(x, y, weight, gridItem));
                if (!this._gridContainer)
                    throw new Error("Grid container not found");
                (_b = this._gridContainer) === null || _b === void 0 ? void 0 : _b.appendChild(gridItem);
            }
        }
    }
    changeItemType(e) {
        if (e.target.value === "pc") {
            this._enabledType = NodeStateEnum.START_POINT;
        }
        else if (e.target.value === "pi") {
            this._enabledType = NodeStateEnum.POINT_OF_INTEREST;
        }
        else if (e.target.value === "obs") {
            this._enabledType = NodeStateEnum.OBS_POINT;
        }
    }
    _isSamePosition(point1, point2) {
        return point1.x === point2.x && point1.y === point2.y;
    }
    _toggleObstacle(node) {
        node.toggleObstacleClass();
    }
    _toggleStartPoint(node) {
        if (!this._startPoint) {
            node.toggleStartPointClass();
            this._startPoint = node;
            return;
        }
        this._startPoint.toggleStartPointClass();
        if (this._startPoint.x === node.x && this._startPoint.y === node.y) {
            this._startPoint = null;
        }
        node.toggleStartPointClass();
        this._startPoint = node;
    }
    _toggleEndPoint(node) {
        if (this._pointsOfInterest.some((item) => {
            return this._isSamePosition(item, node);
        })) {
            node.toggleEndpointClass();
            this._pointsOfInterest = this._pointsOfInterest.filter((item) => !this._isSamePosition(item, node));
        }
        else {
            node.toggleEndpointClass();
            this._pointsOfInterest.push(node);
        }
    }
    toggleItem(e) {
        const x = e.target.getAttribute("data-x");
        const y = e.target.getAttribute("data-y");
        console.log(x, y);
        const point = this._allPoints.find((el) => {
            return el.x == x && el.y == y;
        });
        if (point === undefined)
            throw new Error("Point does not exist (???)");
        switch (this._enabledType.toString()) {
            case "pi":
                this._toggleEndPoint(point);
                break;
            case "pc":
                this._toggleStartPoint(point);
                break;
            case "obs":
                this._toggleObstacle(point);
        }
    }
    findPath() {
        if (this._startPoint === null || this._pointsOfInterest.length === 0) {
            window.alert("Ponto de começo ou de interesse não selecionado!");
            return;
        }
        const aStar = new AStar(this._allPoints, this._startPoint, this._pointsOfInterest);
        aStar.findPath();
    }
}
