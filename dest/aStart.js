export class AStar {
    constructor(allPoints, startPoint, pointsOfInterest, isUsingWeights) {
        this._allPoints = allPoints;
        this._startPoint = startPoint;
        this._isUsingWeights = isUsingWeights;
        this._pointsOfInterest = pointsOfInterest;
    }
    heuristic(node1, node2) {
        if (this._isUsingWeights) {
            return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
        }
        return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
    }
    findPath() {
        const openList = [];
        const closedList = [];
        const finalPoint = this._pointsOfInterest[0];
        openList.push(this._startPoint);
        /*
        while (openList.length > 0) {
          let lowestIndex = 0;
          for (let i = 0; i < openList.length; i++) {
            if (openList[i].f < openList[lowestIndex].f) {
              lowestIndex = i;
            }
          }
    
          const currentNode = openList[lowestIndex];
    
          if (Frontend._isSamePosition(currentNode, finalPoint)) {
            let temp = currentNode;
            const path = [];
            while (temp.parent) {
              path.push(temp);
              temp = temp.parent;
            }
            return path.reverse();
          }
    
          openList.splice(openList.indexOf(currentNode), 1);
          closedList.push(currentNode);
    
          const neighbors = currentNode.neighbors;
          for (let i = 0; i < neighbors.length; i++) {
            const neighbor = neighbors[i];
    
            if (!closedList.includes(neighbor) && !neighbor.isDisabled) {
              const tempG = currentNode.g + 1;
    
              if (openList.includes(neighbor)) {
                if (tempG < neighbor.g) {
                  neighbor.g = tempG;
                }
              } else {
                neighbor.g = tempG;
                openList.push(neighbor);
              }
    
              neighbor.h = this.heuristic(neighbor, this._pointsOfInterest[0]);
              neighbor.f = neighbor.g + neighbor.h;
              neighbor.parent = currentNode;
            }
          }
        }
        return [];
        */
    }
}
