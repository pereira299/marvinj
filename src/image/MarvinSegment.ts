import MarvinMath from "../math/MarvinMath";

export default class MarvinSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  height: number;
  area: number;

  constructor(
    x1 = -1,
    y1 = -1,
    x2 = -1,
    y2 = -1
  ) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;

    if (x1 != -1 && y1 != -1 && x2 != -1 && y2 != -1) {
      this.width = x2 - x1 + 1;
      this.height = y2 - y1 + 1;
      this.area = this.width * this.height;
    }
  }

  segmentMinDistance(segments, minDistance) {
    let s1, s2;
    for (let i = 0; i < segments.size() - 1; i++) {
      for (let j = i + 1; j < segments.size(); j++) {
        s1 = segments[i];
        s2 = segments[j];

        if (
          MarvinMath.euclideanDistance(
            (s1.x1 + s1.x2) / 2,
            (s1.y1 + s1.y2) / 2,
            (s2.x1 + s2.x2) / 2,
            (s2.y1 + s2.y2) / 2,
            0,
            null
          ) < minDistance
        ) {
          segments.splice(j, 1);
          j--;
        }
      }
    }
  }
}
