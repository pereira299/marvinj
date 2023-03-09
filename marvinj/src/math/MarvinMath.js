export default class MarvinMath {
  constructor() {}
  static getTrueMatrix(rows, cols) {
    var ret = MarvinJSUtils.createMatrix2D(rows, cols);

    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        ret[i][j] = true;
      }
    }
    return ret;
  }

  static scaleMatrix(matrix, scale) {
    var ret = MarvinJSUtils.createMatrix2D(matrix.length, matrix.length);

    for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < matrix.length; j++) {
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
    var dx = x1 - x2;
    var dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static euclideanDistance3D(x1, y1, z1, x2, y2, z2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    var dz = z1 - z2;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}
