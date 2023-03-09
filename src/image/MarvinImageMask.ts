import Utils from "../MarvinJSUtils";

export default class MarvinImageMask {
  static NULL_MASK = this.createNullMask();
  width: number;
  height: number;
  arrMask: boolean[][] | null;

  constructor(w, h, mask?: boolean[][]) {
    if (mask != null) {
      this.arrMask = mask;
      this.width = mask.length;
      this.height = mask[0].length;
    } else {
      this.width = w;
      this.height = h;

      if (w != 0 && h != 0) {
        this.arrMask = Utils.createMatrix2D(this.width, this.height);
      } else {
        this.arrMask = null;
      }
    }
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  addPixel(x, y) {
    if (this.arrMask == null) return new Error("Mask is null");
    this.arrMask[x][y] = true;
  }

  removePixel(x, y) {
    if (this.arrMask == null) return new Error("Mask is null");
    this.arrMask[x][y] = false;
  }

  clear() {
    if (this.arrMask != null) {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          this.arrMask[x][y] = false;
        }
      }
    }
  }

  getMask() {
    return this.arrMask;
  }

  addRectRegion(startX, startY, regionWidth, regionHeight) {
    if (this.arrMask == null) return new Error("Mask is null");
    for (let x = startX; x < startX + regionWidth; x++) {
      for (let y = startY; y < startY + regionHeight; y++) {
        this.arrMask[x][y] = true;
      }
    }
  }

  static createNullMask() {
    return new MarvinImageMask(0, 0);
  }
}
