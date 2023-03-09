import MarvinImage from "../../image/MarvinImage";
import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";
import MarvinJSUtils from "../../MarvinJSUtils";

export default class Dilation extends MarvinAbstractImagePlugin {

  matrix: number[][];
  
  constructor() {
    super();
    this.load();
  }

  load () {
    this.matrix = MarvinJSUtils.createMatrix2D(3, 3, true);
    Dilation.setAttribute("matrix", 3);
  }

  process (imgIn, imgOut, attributesOut, mask, previewMode) {
    const matrix = Dilation.getAttribute("matrix");

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
  }

  applyMatrix (x, y, matrix, imgIn, imgOut) {
    let nx, ny;
    const xC = matrix[0].length / 2;
    const yC = matrix.length / 2;

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
  }
}