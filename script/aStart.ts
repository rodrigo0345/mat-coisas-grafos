import { Node } from "./node";

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

  findPath() {}
}
