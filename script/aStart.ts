import { Frontend } from "./frontend.js";
import { Node } from "./node.js";

class NodeBase {
  node: Node;
  f: number;
  g: number;
  h: number;
  connection: NodeBase | null;

  constructor(node: Node) {
    this.node = node;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.connection = null;
  }

  setParent(connection: NodeBase) {
    this.connection = connection;
  }

  setF(f: number) {
    this.f = f;
  }

  getF() {
    return this.f;
  }

  getH() {
    return this.h;
  }

  setH(h: number) {
    this.h = h;
  }

  setG(g: number) {
    this.g = g;
  }

  getG() {
    return this.g;
  }
}

export class AStar {
  _allPoints: Node[];
  _startPoint: Node;
  _pointsOfInterest: Node[];
  _isUsingWeights: boolean;
  _pointsToEnableEnd: Node[];
  _delay: number;

  constructor(
    allPoints: Node[],
    startPoint: Node,
    pointsOfInterest: Node[],
    isUsingWeights: boolean,
    delay: number
  ) {
    this._allPoints = allPoints;
    this._startPoint = startPoint;
    this._isUsingWeights = isUsingWeights;
    this._pointsOfInterest = pointsOfInterest;
    this._pointsToEnableEnd = [];
    this._delay = delay;
  }

  heuristic(node1: Node, node2: Node) {
    return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
  }

  smallerF(nodeArr: NodeBase[]) {
    let smaller = nodeArr[0];
    nodeArr.forEach((node) => {
      if (node.getF() < smaller.getF()) {
        smaller = node;
      }
    });
    return smaller;
  }

  async findPath() {
    let startPoint = new NodeBase(this._startPoint);

    for (let n = 0; n < this._pointsOfInterest.length; n++) {
      let endPoint = new NodeBase(this._pointsOfInterest[n]);

      if(n == this._pointsOfInterest.length){
        break;
      }

      let openList: NodeBase[] = [startPoint];
      let closedList: NodeBase[] = [];

      let found = false;
      while (openList.length > 0) {
        let q = this.smallerF(openList);
        await this.sleep(this._delay); // This is just for visualization purposes

        // pop from the open list
        openList = openList.filter((node) => {
          return !node.node.equals(q.node);
        });

        // check for end
        if (!q) {
          break;
        }
        if (q.node.equals(endPoint.node)) {
          break;
        }

        const successors = this.getNeighbors(q.node).filter((neighbor) => {
          return !neighbor.node.isDisabled && !closedList.some(el => {
            return el.node.equals(neighbor.node);
          });
        });
        successors.forEach((neighbor) => {
          neighbor.setParent(q);
        });

        let objective: NodeBase | null = null;

        for (let i = 0; i < successors.length; i++) {
          let neighbor = successors[i];
          if (
            neighbor.node.equals(endPoint.node) &&
            n < this._pointsOfInterest.length
          ) {
            found = true;
            objective = neighbor;
            startPoint = neighbor;
          }
          if (
            neighbor.node.equals(endPoint.node) &&
            n == this._pointsOfInterest.length
          ) {
            found = true;
            objective = neighbor;
            break;
          }

          neighbor.setG(q.g + 1);
          neighbor.setH(this.heuristic(neighbor.node, endPoint.node));
          console.log(
            "weight",
            this._isUsingWeights ? neighbor.node.weight : 0
          );
          neighbor.setF(
            neighbor.getG() +
              neighbor.getH() +
              (this._isUsingWeights ? neighbor.node.weight : 0)
          );

          if (
            openList.some(
              (node) =>
                node.node.equals(neighbor.node) && node.getF() < neighbor.getF()
            )
          ) {
            continue;
          }

          if (
            closedList.some(
              (node) =>
                node.node.equals(neighbor.node) && node.getF() < neighbor.getF()
            )
          ) {
            continue;
          } else {
            openList.push(neighbor);
          }
        }

        q.node.enableDebugClass();
        closedList.push(q);

        if (found) {
          startPoint.node = this._pointsOfInterest[n];
          let current = objective!;
          this.colorPath(current);
          openList: null;
          break;
        }
      }

      if (!found) {
        window.alert("Caminho não encontrado!");
      }
    }
    this._pointsToEnableEnd.forEach((node) => {
      node.activateNode();
    });
  }

  private colorPath(node: NodeBase) {
    node.node.disableNode();
    this._pointsToEnableEnd.push(node.node);
    if (node.connection) {
      this.colorPath(node.connection);
    }
    node.node.colorPath();
  }

  private getNeighbors(node: Node): NodeBase[] {
    const neighbors: NodeBase[] = [];
    const x = node.x;
    const y = node.y;

    // top neighbor
    if (y - 1 > 0) {
      const topNeighbor = this._allPoints.find(
        (p) => p.x === x && p.y === y - 1
      );
      if (topNeighbor) {
        let nodeBase = new NodeBase(topNeighbor);
        neighbors.push(nodeBase);
      }
    }

    // bottom neighbor
    if (y + 1 <= Frontend._gridSize) {
      const bottomNeighbor = this._allPoints.find(
        (p) => p.x === x && p.y === y + 1
      );
      if (bottomNeighbor) {
        let nodeBase = new NodeBase(bottomNeighbor);
        neighbors.push(nodeBase);
      }
    }

    // left neighbor
    if (x - 1 > 0) {
      const leftNeighbor = this._allPoints.find(
        (p) => p.x === x - 1 && p.y === y
      );

      if (leftNeighbor) {
        let nodeBase = new NodeBase(leftNeighbor);
        neighbors.push(nodeBase);
      }
    }

    // right neighbor
    if (x + 1 <= Frontend._gridSize) {
      const rightNeighbor = this._allPoints.find(
        (p) => p.x === x + 1 && p.y === y
      );
      if (rightNeighbor) {
        let nodeBase = new NodeBase(rightNeighbor);
        neighbors.push(nodeBase);
      }
    }

    return neighbors;
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
