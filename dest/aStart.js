var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Frontend } from "./frontend.js";
class NodeBase {
    constructor(node) {
        this.node = node;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.connection = null;
    }
    setParent(connection) {
        this.connection = connection;
    }
    setF(f) {
        this.f = f;
    }
    getF() {
        return this.f;
    }
    getH() {
        return this.h;
    }
    setH(h) {
        this.h = h;
    }
    setG(g) {
        this.g = g;
    }
    getG() {
        return this.g;
    }
}
export class AStar {
    constructor(allPoints, startPoint, pointsOfInterest, isUsingWeights, delay) {
        this._allPoints = allPoints;
        this._startPoint = startPoint;
        this._isUsingWeights = isUsingWeights;
        this._pointsOfInterest = pointsOfInterest;
        this._pointsToEnableEnd = [];
        this._delay = delay;
    }
    heuristic(node1, node2) {
        return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
    }
    smallerF(nodeArr) {
        let smaller = nodeArr[0];
        nodeArr.forEach((node) => {
            if (node.getF() < smaller.getF()) {
                smaller = node;
            }
        });
        return smaller;
    }
    findPath() {
        return __awaiter(this, void 0, void 0, function* () {
            let startPoint = new NodeBase(this._startPoint);
            for (let n = 0; n < this._pointsOfInterest.length; n++) {
                let endPoint = new NodeBase(this._pointsOfInterest[n]);
                if (n == this._pointsOfInterest.length) {
                    break;
                }
                let openList = [startPoint];
                let closedList = [];
                let found = false;
                while (openList.length > 0) {
                    let q = this.smallerF(openList);
                    yield this.sleep(this._delay); // This is just for visualization purposes
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
                    let objective = null;
                    for (let i = 0; i < successors.length; i++) {
                        let neighbor = successors[i];
                        if (neighbor.node.equals(endPoint.node) &&
                            n < this._pointsOfInterest.length) {
                            found = true;
                            objective = neighbor;
                            startPoint = neighbor;
                        }
                        if (neighbor.node.equals(endPoint.node) &&
                            n == this._pointsOfInterest.length) {
                            found = true;
                            objective = neighbor;
                            break;
                        }
                        neighbor.setG(q.g + 1);
                        neighbor.setH(this.heuristic(neighbor.node, endPoint.node));
                        console.log("weight", this._isUsingWeights ? neighbor.node.weight : 0);
                        neighbor.setF(neighbor.getG() +
                            neighbor.getH() +
                            (this._isUsingWeights ? neighbor.node.weight : 0));
                        if (openList.some((node) => node.node.equals(neighbor.node) && node.getF() < neighbor.getF())) {
                            continue;
                        }
                        if (closedList.some((node) => node.node.equals(neighbor.node) && node.getF() < neighbor.getF())) {
                            continue;
                        }
                        else {
                            openList.push(neighbor);
                        }
                    }
                    q.node.enableDebugClass();
                    closedList.push(q);
                    if (found) {
                        startPoint.node = this._pointsOfInterest[n];
                        let current = objective;
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
        });
    }
    colorPath(node) {
        node.node.disableNode();
        this._pointsToEnableEnd.push(node.node);
        if (node.connection) {
            this.colorPath(node.connection);
        }
        node.node.colorPath();
    }
    getNeighbors(node) {
        const neighbors = [];
        const x = node.x;
        const y = node.y;
        // top neighbor
        if (y - 1 > 0) {
            const topNeighbor = this._allPoints.find((p) => p.x === x && p.y === y - 1);
            if (topNeighbor) {
                let nodeBase = new NodeBase(topNeighbor);
                neighbors.push(nodeBase);
            }
        }
        // bottom neighbor
        if (y + 1 <= Frontend._gridSize) {
            const bottomNeighbor = this._allPoints.find((p) => p.x === x && p.y === y + 1);
            if (bottomNeighbor) {
                let nodeBase = new NodeBase(bottomNeighbor);
                neighbors.push(nodeBase);
            }
        }
        // left neighbor
        if (x - 1 > 0) {
            const leftNeighbor = this._allPoints.find((p) => p.x === x - 1 && p.y === y);
            if (leftNeighbor) {
                let nodeBase = new NodeBase(leftNeighbor);
                neighbors.push(nodeBase);
            }
        }
        // right neighbor
        if (x + 1 <= Frontend._gridSize) {
            const rightNeighbor = this._allPoints.find((p) => p.x === x + 1 && p.y === y);
            if (rightNeighbor) {
                let nodeBase = new NodeBase(rightNeighbor);
                neighbors.push(nodeBase);
            }
        }
        return neighbors;
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
