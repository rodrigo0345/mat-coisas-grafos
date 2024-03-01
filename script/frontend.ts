import { Node } from "./node.js";

enum NodeStateEnum {
  START_POINT = "pc",
  OBS_POINT = "obs",
  POINT_OF_INTEREST = "pi",
}

export class Frontend {
  _window: Window;
  _selectedList: HTMLElement;

  _allPoints: Node[] = [];
  _pointsOfInterest: Node[] = [];
  _obstaclePoints: Node[] = [];

  _startPoint: Node | null = null;
  _endPoint: Node | null = null;

  _gridContainer: HTMLElement | null = null;
  _gridSize: number = 6;

  _enabledType = NodeStateEnum.OBS_POINT;

  constructor(
    selectedList: HTMLElement,
    gridContainer: HTMLElement,
    window: Window
  ) {
    this._selectedList = selectedList;
    this._gridContainer = gridContainer;
    this._window = window;
  }

  generateGrid() {
    for (let x = -2; x < this._gridSize; x++) {
      for (let y = -2; y < this._gridSize; y++) {
        const weight = Math.floor(Math.random() * 8) + 1; // Random weight from 1 to 10
        const gridItem = document.createElement("div");
        gridItem.classList.add("grid-item");
        gridItem.setAttribute("data-x", x.toString());
        gridItem.setAttribute("data-y", y.toString());
        gridItem.setAttribute("data-weight", weight.toString());
        gridItem.textContent = weight.toString();

        if (!this._gridContainer) throw new Error("Grid container not found");

        this._gridContainer?.appendChild(gridItem);
      }
    }
  }

  _isSamePosition(point1: Node, point2: Node) {
    return point1.x === point2.x && point1.y === point2.y;
  }

  changeItemType(e: any) {
    if (e.target.value === "pc") {
      this._enabledType = NodeStateEnum.START_POINT;
    } else if (e.target.value === "pi") {
      this._enabledType = NodeStateEnum.POINT_OF_INTEREST;
    } else if (e.target.value === "obs") {
      this._enabledType = NodeStateEnum.OBS_POINT;
    }
  }

  toggleItem(e: any) {
    const x = e.target.getAttribute("data-x");
    const y = e.target.getAttribute("data-y");
    const weight = e.target.getAttribute("data-weight");
    const point = new Node(x, y, weight, e.target);

    switch (this._enabledType.toString()) {
      case "pi":
        if (
          this._pointsOfInterest.some((item) => {
            return this._isSamePosition(item, point);
          })
        ) {
          e.target.classList.remove("pi-class");
          this._pointsOfInterest = this._pointsOfInterest.filter(
            (item) => !this._isSamePosition(item, point)
          );
        } else {
          e.target.classList.add("pi-class");
          this._pointsOfInterest.push(point);
        }
        break;
      case "pc":
        if (this._startPoint !== null) {
          this._startPoint.element.classList.remove("pc-class");
          if (this._startPoint.x === x && this._startPoint.y === y) {
            this._startPoint = null;
          }
          e.target.classList.add("pc-class");
          this._startPoint = point;
        } else {
          e.target.classList.add("pc-class");
          this._startPoint = point;
        }
        break;
      case "obs":
        if (
          this._obstaclePoints.some((item) => {
            return this._isSamePosition(item, point);
          })
        ) {
          e.target.classList.remove("obs-class");
          this._obstaclePoints = this._obstaclePoints.filter(
            (item) => !this._isSamePosition(item, point)
          );
        } else {
          e.target.classList.add("obs-class");
          this._obstaclePoints.push(point);
        }
        break;
    }
  }
}
