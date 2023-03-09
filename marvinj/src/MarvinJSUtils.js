export default class Utils {
  constructor() {}

  static createMatrix2D(rows, cols, value) {
    let arr = new Array(rows);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(cols);
      arr[i].fill(value);
    }
    return arr;
  }

  static createMatrix3D(rows, cols, depth, value) {
    let arr = new Array(rows);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(cols);
      for (let j = 0; j < arr[i].length; j++) {
        arr[i][j] = new Array(depth);
        arr[i][j].fill(value);
      }
    }
    return arr;
  }

  static createMatrix4D(rows, cols, depth, another, value) {
    let arr = new Array(rows);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(cols);
      for (let j = 0; j < arr[i].length; j++) {
        arr[i][j] = new Array(depth);
        for (let w = 0; w < arr[i][j].length; w++) {
          arr[i][j][w] = new Array(another);
          arr[i][j][w].fill(value);
        }
      }
    }
    return arr;
  }
}
