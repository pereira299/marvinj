export default class MarvinMath {
  constructor() {}
  static getTrueMatrix(rows, cols) {
    let ret = MarvinJSUtils.createMatrix2D(rows, cols);

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        ret[i][j] = true;
      }
    }
    return ret;
  }

  static scaleMatrix(matrix, scale) {
    let ret = MarvinJSUtils.createMatrix2D(matrix.length, matrix.length);

    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        ret[i][j] = matrix[i][j] * scale;
      }
    }
    return ret;
  }

  static euclideanDistance(p1, p2, p3, p4, p5, p6) {
    if (p6 != null) {
      return euclideanDistance3D(p1, p2, p3, p4, p5, p6);
    } else {
      return euclideanDistance3D(p1, p2, p3, p4);
    }
  }

  static euclideanDistance2D(x1, y1, x2, y2) {
    let dx = x1 - x2;
    let dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static euclideanDistance3D(x1, y1, z1, x2, y2, z2) {
    let dx = x1 - x2;
    let dy = y1 - y2;
    let dz = z1 - z2;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}
