import MarvinJSUtils from "../MarvinJSUtils";
export default class MarvinMath {
  constructor() {}

  static getTrueMatrix(rows, cols) {
    const ret = MarvinJSUtils.createMatrix2D(rows, cols, true);

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        ret[i][j] = true;
      }
    }
    return ret;
  }

  static scaleMatrix(matrix, scale) {
    const ret = MarvinJSUtils.createMatrix2D(matrix.length, matrix.length, 0);

    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        ret[i][j] = matrix[i][j] * scale;
      }
    }
    return ret;
  }

  static euclideanDistance(p1, p2, p3, p4, p5, p6) {
    if (p6 != null) {
      return this.euclideanDistance3D(p1, p2, p3, p4, p5, p6);
    } else {
      return this.euclideanDistance3D(p1, p2, p3, p4, p5, 0);
    }
  }

  static euclideanDistance2D(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static euclideanDistance3D(x1, y1, z1, x2, y2, z2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    const dz = z1 - z2;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}
