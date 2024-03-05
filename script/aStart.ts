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
    return this.g + this.h;
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

  constructor(
    allPoints: Node[],
    startPoint: Node,
    pointsOfInterest: Node[],
    isUsingWeights: boolean
  ) {
    this._allPoints = allPoints;
    this._startPoint = startPoint;
    this._isUsingWeights = isUsingWeights;
    this._pointsOfInterest = pointsOfInterest;
  }

  heuristic(node1: Node, node2: Node) {
    if (this._isUsingWeights) {
      const dx = Math.abs(node1.x - node2.x);
      const dy = Math.abs(node1.y - node2.y);
      const heuristicWithoutWeights = dx + dy;
      const weightFactor = node2.weight; // You can adjust this based on your specific weights
      return heuristicWithoutWeights * weightFactor;
    }
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
    const startPoint = new NodeBase(this._startPoint);
    const endPoint = new NodeBase(this._pointsOfInterest[0]);

    let openList: NodeBase[] = [startPoint];
    let closedList: NodeBase[] = [];

    let found = false;
    while (openList.length > 0) {
      let q = this.smallerF(openList);
      await this.sleep(50); // This is just for visualization purposes

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
        return !neighbor.node.isDisabled;
      });
      successors.forEach((neighbor) => {
        neighbor.setParent(q);
      });

      let objective: NodeBase | null = null;

      for (let i = 0; i < successors.length; i++) {
        const neighbor = successors[i];
        if (neighbor.node.equals(endPoint.node)) {
          found = true;
          objective = neighbor;
          break;
        }

        neighbor.setG(q.g + 1);
        neighbor.setH(this.heuristic(neighbor.node, endPoint.node));
        neighbor.setF(neighbor.getG() + neighbor.getH());

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
        let current = objective!;
        this.colorPath(current);
        break;
      }
    }

    if (!found) {
      window.alert("Caminho não encontrado!");
    }
  }

  private colorPath(node: NodeBase) {
    if (node.connection) {
      this.colorPath(node.connection);
    }
    node.node.togglePath();
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
