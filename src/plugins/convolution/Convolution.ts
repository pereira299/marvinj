import MarvinImage from "../../image/MarvinImage";
import MarvinImageMask from "../../image/MarvinImageMask";
import MarvinAttributes from "../../util/MarvinAttributes";
import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class Convolution extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load () {
    Convolution.setAttribute("matrix", null);
  }

  process (
    imageIn: MarvinImage,
    attributesOut: MarvinAttributes,
    mask: MarvinImageMask,
    previewMode: boolean
  ) {
    const matrix = Convolution.getAttribute("matrix");
    console.log("matrix: ", matrix);
    let imageOut = imageIn.clone();
    if (matrix != null && matrix.length > 0) {
      for (let y = 0; y < imageIn.getHeight(); y++) {
        for (let x = 0; x < imageIn.getWidth(); x++) {
          if (
            y >= matrix.length / 2 &&
            y < imageIn.getHeight() - matrix.length / 2 &&
            x >= matrix[0].length / 2 &&
            x < imageIn.getWidth() - matrix[0].length / 2
          ) {
            imageOut = this.applyMatrix(x, y, matrix, imageIn, imageOut);
          } else {
            imageOut = imageOut.setIntColor(x, y, 0xff000000);
          }
        }
      }
    }
    return imageOut;
  }

  applyMatrix (x:number, y:number, matrix:number[][], imageIn:MarvinImage, imageOut:MarvinImage) {
    let nx, ny;
    let resultRed = 0;
    let resultGreen = 0;
    let resultBlue = 0;

    const xC = Math.ceil(matrix[0].length / 2);
    const yC = Math.ceil(matrix.length / 2);

    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[0].length; j++) {
        if (matrix[i][j] != 0) {
          nx = x + (j - xC);
          ny = y + (i - yC);

          if (
            nx >= 0 &&
            nx < imageOut.getWidth() &&
            ny >= 0 &&
            ny < imageOut.getHeight()
          ) {
            resultRed += matrix[i][j] * imageIn.getIntComponent0(nx, ny);
            resultGreen += matrix[i][j] * imageIn.getIntComponent1(nx, ny);
            resultBlue += matrix[i][j] * imageIn.getIntComponent2(nx, ny);
          }
        }
      }
    }

    resultRed = Math.abs(resultRed);
    resultGreen = Math.abs(resultGreen);
    resultBlue = Math.abs(resultBlue);
    // allow the combination of multiple applications
    // resultRed += imageOut.getIntComponent0(x, y);
    // resultGreen += imageOut.getIntComponent1(x, y);
    // resultBlue += imageOut.getIntComponent2(x, y);
    
    // resultRed = Math.min(resultRed, 255);
    // resultGreen = Math.min(resultGreen, 255);
    // resultBlue = Math.min(resultBlue, 255);
    
    // resultRed = Math.max(resultRed, 0);
    // resultGreen = Math.max(resultGreen, 0);
    // resultBlue = Math.max(resultBlue, 0);
    
    console.log("R: " + Math.floor(resultRed), " G: " + Math.floor(resultGreen), " B: " + Math.floor(resultBlue));
    imageOut.setIntColor(
      x,
      y,
      imageIn.getAlphaComponent(x, y),
      Math.floor(resultRed),
      Math.floor(resultGreen),
      Math.floor(resultBlue)
    );

    return imageOut;
  }
}
