import Utils from "../MarvinJSUtils";

export default class MarvinImageMask {
  NULL_MASK = this.createNullMask();

  constructor(w, h) {
    this.width = w;
    this.height = h;

    if (w != 0 && h != 0) {
      this.arrMask = Utils.createMatrix2D(width, height);
    } else {
      this.arrMask = null;
    }
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  addPixel = function (x, y) {
    this.arrMask[x][y] = true;
  };

  removePixel = function (x, y) {
    this.arrMask[x][y] = false;
  };

  clear() {
    if (this.arrMask != null) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          this.arrMask[x][y] = false;
        }
      }
    }
  }

  getMask() {
    return this.arrMask;
  }

  addRectRegion = function (startX, startY, regionWidth, regionHeight) {
    for (let x = startX; x < startX + regionWidth; x++) {
      for (let y = startY; y < startY + regionHeight; y++) {
        this.arrMask[x][y] = true;
      }
    }
  };

  createNullMask() {
    return new MarvinImageMask(0, 0);
  }
}
