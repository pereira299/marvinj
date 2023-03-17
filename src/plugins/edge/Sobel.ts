import MarvinImage from "../../image/MarvinImage";
import MarvinImageMask from "../../image/MarvinImageMask";
import MarvinMath from "../../math/MarvinMath";
import MarvinAttributes from "../../util/MarvinAttributes";
import Convolution from "../convolution/Convolution";
import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class Sobel extends MarvinAbstractImagePlugin {
  matrixSobelX: number[][];
  matrixSobelY: number[][];
  matrixSobelDiagonal: number[][];
  matrixSobelDiagonal2: number[][];
  convolution: Convolution;
  previewMode = false;

  constructor() {
    super();
    // Definitions
    this.matrixSobelX = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ];

    this.matrixSobelY = [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1],
    ];

    this.matrixSobelDiagonal = [
      [0, -1, -2],
      [1, 0, -1],
      [2, 1, 0],
    ];

    this.matrixSobelDiagonal2 = [
        [2, 1, 0],
        [1, 0, -1],
        [0, -1, -2],
    ];

    this.load();
  }

  load() {
    this.convolution = new Convolution();
    Sobel.setAttribute("intensity", 1.0);
  }

  process(
    imageIn: MarvinImage,
    attrOut: MarvinAttributes,
    mask: MarvinImageMask,
    previewMode: boolean
  ) {
    const intensity = Sobel.getAttribute("intensity");
    let imageOut = imageIn.clone(false);
    if (intensity == 1) {
      // console.log(
      //   "in R: " + imageIn.getIntComponent0(0, 0),
      //   " G: " + imageIn.getIntComponent1(0, 0),
      //   " B: " + imageIn.getIntComponent2(0, 0),
      //   "Alpha: " + imageIn.getAlphaComponent(0, 0)
      // );
      console.time("convolution X");
      Convolution.setAttribute("matrix", this.matrixSobelX);
      imageOut = this.convolution.process(imageOut, this.matrixSobelX);
      console.timeEnd("convolution X");
      console.time("convolution Y");
      Convolution.setAttribute("matrix", this.matrixSobelY);
      imageOut = this.convolution.process(imageOut, this.matrixSobelY);
      console.timeEnd("convolution Y");
      console.time("convolution Diagonal");
      Convolution.setAttribute("matrix", this.matrixSobelDiagonal);
      imageOut = this.convolution.process(imageOut, this.matrixSobelDiagonal);
      console.timeEnd("convolution Diagonal");
      console.time("convolution Diagonal2");
      Convolution.setAttribute("matrix", this.matrixSobelDiagonal2);
      imageOut = this.convolution.process(imageOut, this.matrixSobelDiagonal2);
      console.timeEnd("convolution Diagonal2");
      // console.log(
      //   "out R: " + imageOut.getIntComponent0(0, 0),
      //   " G: " + imageOut.getIntComponent1(0, 0),
      //   " B: " + imageOut.getIntComponent2(0, 0),
      //   "Alpha: " + imageOut.getAlphaComponent(0, 0)
      // );
    } else {
      Convolution.setAttribute(
        "matrix",
        MarvinMath.scaleMatrix(this.matrixSobelX, intensity)
      );
      imageOut = this.convolution.process(imageOut, this.matrixSobelX);
      Convolution.setAttribute(
        "matrix",
        MarvinMath.scaleMatrix(this.matrixSobelY, intensity)
      );
      imageOut = this.convolution.process(imageOut, this.matrixSobelY);
    }
    return imageOut;
  }
}
