import { AStar } from "./aStart.js";
import { Node } from "./node.js";

enum NodeStateEnum {
  START_POINT = "pc",
  OBS_POINT = "obs",
  POINT_OF_INTEREST = "pi",
}

export class Frontend {
  _window: Window;
  _allPoints: Node[] = [];
  _pointsOfInterest: Node[] = [];
  _obstaclePoints: Node[] = [];

  _startPoint: Node | null = null;

  _gridContainer: HTMLElement | null = null;
  _findBtn: HTMLElement | null = null;
  _weightBtn: HTMLElement | null = null;

  static _gridSize: number = 10;
  _isUsingWeights: boolean = true;
  _delay: number = 50;
  _isrunnign: boolean = false;
  

  _enabledType = NodeStateEnum.OBS_POINT;

  constructor(
    gridContainer: HTMLElement,
    window: Window,
    findBtn: HTMLElement,
    weightBtn: HTMLElement
  ) {
    this._gridContainer = gridContainer;
    this._window = window;
    this._findBtn = findBtn;
    this._weightBtn = weightBtn;
  }

  changeDelay(value: number) {
    this._delay = value;
  }

  reset(){
    const i = document.querySelectorAll('.debug-class');
    const d = document.querySelectorAll('.path-class');

    i.forEach((item) => {
      item.classList.remove('debug-class');
    });

    d.forEach((item) => {
      item.classList.remove('path-class');
    });
  }
  generateGrid() {
    
    // remove all children from grid container
    while (this._gridContainer?.firstChild) {
      this._gridContainer.removeChild(this._gridContainer.firstChild);
    }

    this._findBtn?.addEventListener("click", () => {
      this.findPath();
    });

    this._gridContainer?.style.setProperty(
      "grid-template-columns",
      `repeat(${Frontend._gridSize}, 1fr)`
    );

    for (let y = 1; y <= Frontend._gridSize; y++) {
      for (let x = 1; x <= Frontend._gridSize; x++) {
        const weight = Math.floor(Math.random() * 8) + 1; // Random weight from 1 to 10
        const gridItem = document.createElement("div");
        gridItem.classList.add("grid-item");
        gridItem.setAttribute("data-x", x.toString());
        gridItem.setAttribute("data-y", y.toString());
        gridItem.setAttribute("data-weight", weight.toString());
        gridItem.textContent = weight.toString();

        this._allPoints.push(new Node(x, y, weight, gridItem));

        if (!this._gridContainer) throw new Error("Grid container not found");

        this._gridContainer?.appendChild(gridItem);
      }
    }
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

  static _isSamePosition(point1: Node, point2: Node) {
    return point1.x === point2.x && point1.y === point2.y;
  }

  private _toggleObstacle(node: Node) {
    node.toggleObstacleClass();
  }

  private _toggleStartPoint(node: Node) {
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

  private _toggleEndPoint(node: Node) {
    if (node.element.classList.contains("obs-class")) return;
    if (node.element.classList.contains("pc-class")) return;
    if (
      this._pointsOfInterest.some((item) => {
        return Frontend._isSamePosition(item, node);
      })
    ) {
      node.toggleEndpointClass();
      this._pointsOfInterest = this._pointsOfInterest.filter(
        (item) => !Frontend._isSamePosition(item, node)
      );
    } else {
      node.toggleEndpointClass();
      this._pointsOfInterest.push(node);
    }
  }

  toggleItem(e: any) {
    const x = e.target.getAttribute("data-x");
    const y = e.target.getAttribute("data-y");
    const point = this._allPoints.find((el) => {
      return el.x == x && el.y == y;
    });

    if (point === undefined) throw new Error("Point does not exist (???)");

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

  toggleWeights() {
    this._allPoints.forEach((point) => {
      point.toggleHideText();
    });
    this._isUsingWeights = !this._isUsingWeights;
  }

  disableWeights(){
    this._allPoints.forEach((point) => {
      point.toggleHideText();
    });
    this._isUsingWeights = false;
  }  
  


  private isFindingPath: boolean = false;

  findPath() {
      
      if (this.isFindingPath) {
          console.log("A path finding operation is already in progress.");
          return;
      }
  
      if (this._startPoint === null || this._pointsOfInterest.length === 0) {
          window.alert("Ponto de começo ou de interesse não selecionado!");
          return;
      }
      this.reset();
      console.log("using weights", this._isUsingWeights);
      const aStar = new AStar(
          this._allPoints,
          this._startPoint,
          this._pointsOfInterest,
          this._isUsingWeights,
          this._delay
      );
  
      this.isFindingPath = true;
  
      aStar.findPath().then(() => {          
          this.isFindingPath = false; 
      });
  }
}
