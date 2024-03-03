import { Node } from "./node";

export class AStar {
  _allPoints: Node[];
  _startPoint: Node;
  _pointsOfInterest: Node[];

  constructor(allPoints: Node[], startPoint: Node, pointsOfInterest: Node[]) {
    this._allPoints = allPoints;
    this._startPoint = startPoint;
    this._pointsOfInterest = pointsOfInterest;
  }

  findPath() {}
}
