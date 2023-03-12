export default class Utils {
  constructor() {}

  static createMatrix2D(rows: number, cols: number, value: any = 0) {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => value)
    );
  }

  static createMatrix3D(
    rows: number,
    cols: number,
    depth: number,
    value: any = 0
  ) {
    return Array.from({ length: rows }, () => {
      return Array.from({ length: cols }, () => {
        return Array.from({ length: depth }, () => value);
      });
    });
  }

  static createMatrix4D(
    rows: number,
    cols: number,
    depth: number,
    another: number,
    value: any = 0
  ) {
    return Array.from({ length: rows }, () => {
      return Array.from({ length: cols }, () => {
        return Array.from({ length: depth }, () => {
          return Array.from({ length: another }, () => value);
        });
      });
    });
  }

  static deepCopy(data: object | Array<any>) {
    return JSON.parse(JSON.stringify(data));
  }
}
