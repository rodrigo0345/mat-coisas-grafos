import { Frontend } from "./frontend";
import { Node } from "./node";

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

  setConnection(connection: NodeBase) {
    this.connection = connection;
  }

  setF(f: number) {
    this.f = f;
  }

  setG(g: number) {
    this.g = g;
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
      return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
    }
    return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
  }

  private getNeighbors(node: Node): Node[] {
    const neighbors: Node[] = [];
    const x = node.x;
    const y = node.y;

    // top neighbor
    if (y - 1 >= 0) {
      const topNeighbor = this._allPoints.find(
        (p) => p.x === x && p.y === y - 1
      );
      if (topNeighbor) {
        neighbors.push(topNeighbor);
      }
    }

    // bottom neighbor
    if (y + 1 < Frontend._gridSize) {
      const bottomNeighbor = this._allPoints.find(
        (p) => p.x === x && p.y === y + 1
      );
      if (bottomNeighbor) {
        neighbors.push(bottomNeighbor);
      }
    }

    // left neighbor
    if (x - 1 >= 0) {
      const leftNeighbor = this._allPoints.find(
        (p) => p.x === x - 1 && p.y === y
      );

      if (leftNeighbor) {
        neighbors.push(leftNeighbor);
      }
    }

    // right neighbor
    if (x + 1 < Frontend._gridSize) {
      const rightNeighbor = this._allPoints.find(
        (p) => p.x === x + 1 && p.y === y
      );
      if (rightNeighbor) {
        neighbors.push(rightNeighbor);
      }
    }

    return neighbors;
  }

  findPath() {
    const allPoints = this._allPoints.map((point) => new NodeBase(point));

    const startPoint = new NodeBase(this._startPoint);
    const toSearch: NodeBase[] = [startPoint];
    const processed: NodeBase[] = [];
    const finalPoint = this._pointsOfInterest[0];

    while (toSearch.length > 0) {
      let current = toSearch[0];

      // ver se algum dos pontos para pesquisar tem melhor f
      toSearch.forEach((point) => {
        if (
          point.f < current.f ||
          (point.f === current.f && point.h < current.h)
        ) {
          current = point;
        }
      });

      processed.push(current);

      // remove o ponto atual da lista de pontos para pesquisar
      toSearch.splice(toSearch.indexOf(current), 1);

      this.getNeighbors(current.node)
        .filter(
          (neighbor) =>
            !processed.some((p) => p.node === neighbor) && !neighbor.isDisabled
        )
        .forEach((neighbor) => {
          const inSearch = toSearch.find((p) => p.node === neighbor);

          // get distance já tem em conta o peso
          const costToNeighbor = current.g + current.node.getDistance(neighbor);
        });
    }
  }
}
