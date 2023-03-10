import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";
import MarvinJSUtils from "../../MarvinJSUtils";
import MarvinImage from "../../image/MarvinImage";
import MarvinAttributes from "../../util/MarvinAttributes";
import MarvinImageMask from "../../image/MarvinImageMask";

export default class Erosion extends MarvinAbstractImagePlugin {
  matrix: number[][];

  constructor() {
    super();
    this.load();
  }

  load() {
    this.matrix = MarvinJSUtils.createMatrix2D(3, 3, true);
    Erosion.setAttribute("matrix", 3);
  }

  process(
    imgIn: MarvinImage,
    attributesOut: MarvinAttributes,
    mask: MarvinImageMask,
    previewMode: boolean
  ) {
    const matrix = Erosion.getAttribute("matrix");
    let imgOut = imgIn.clone();
    if (
      imgIn.getColorModel() == MarvinImage.COLOR_MODEL_BINARY &&
      matrix != null
    ) {
      MarvinImage.copyColorArray(imgIn, imgOut);

      for (let y = 0; y < imgIn.getHeight(); y++) {
        for (let x = 0; x < imgIn.getWidth(); x++) {
          imgOut = this.applyMatrix(x, y, matrix, imgIn, imgOut);
        }
      }
    }
    return imgOut;
  }

  applyMatrix(x, y, matrix, imgIn, imgOut) {
    let nx, ny;

    const xC = Math.floor(matrix[0].length / 2);
    const yC = Math.floor(matrix.length / 2);

    if (!imgIn.getBinaryColor(x, y)) {
      for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
          if ((i != yC || j != xC) && matrix[i][j]) {
            nx = x + (j - xC);
            ny = y + (i - yC);

            if (
              nx >= 0 &&
              nx < imgOut.getWidth() &&
              ny >= 0 &&
              ny < imgOut.getHeight()
            ) {
              imgOut.setBinaryColor(nx, ny, false);
            }
          }
        }
      }
    }
    return imgOut;
  }
}
