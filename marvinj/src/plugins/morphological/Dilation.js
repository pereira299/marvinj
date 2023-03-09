import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class Dilation extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load = function () {
    this.matrix = MarvinJSUtils.createMatrix2D(3, 3, true);
    this.setAttribute("matrix", 3);
  };

  process = function (imgIn, imgOut, attributesOut, mask, previewMode) {
    let matrix = this.getAttribute("matrix");

    if (
      imgIn.getColorModel() == MarvinImage.COLOR_MODEL_BINARY &&
      matrix != null
    ) {
      MarvinImage.copyColorArray(imgIn, imgOut);

      for (let y = 0; y < imgIn.getHeight(); y++) {
        for (let x = 0; x < imgIn.getWidth(); x++) {
          this.applyMatrix(x, y, matrix, imgIn, imgOut);
        }
      }
    }
  };

  applyMatrix = function (x, y, matrix, imgIn, imgOut) {
    let nx, ny;
    let xC = matrix[0].length / 2;
    let yC = matrix.length / 2;

    if (imgIn.getBinaryColor(x, y)) {
      for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix.length; j++) {
          if ((i != yC || j != xC) && matrix[i][j]) {
            nx = x + (j - xC);
            ny = y + (i - yC);

            if (
              nx > 0 &&
              nx < imgOut.getWidth() &&
              ny > 0 &&
              ny < imgOut.getHeight()
            ) {
              imgOut.setBinaryColor(nx, ny, true);
            }
          }
        }
      }
    }
  };
}