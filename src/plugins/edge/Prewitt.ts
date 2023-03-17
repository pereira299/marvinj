import MarvinImage from "../../image/MarvinImage";
import MarvinImageMask from "../../image/MarvinImageMask";
import MarvinMath from "../../math/MarvinMath";
import MarvinAttributes from "../../util/MarvinAttributes";
import Convolution from "../convolution/Convolution";
import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class Prewitt extends MarvinAbstractImagePlugin {

  matrixPrewittX: number[][];
  matrixPrewittY: number[][];
  matrixPrewittDiagonal: number[][];
  matrixPrewittDiagonal2: number[][];
  convolution: Convolution;
  previewMode = false;

  constructor() {
    super();
    // Definitions
    this.matrixPrewittX = [
      [1, 0, -1],
      [1, 0, -1],
      [1, 0, -1],
    ];

    this.matrixPrewittY = [
      [1, 1, 1],
      [0, 0, 0],
      [-1, -1, -1],
    ];

    this.matrixPrewittDiagonal = [
      [0, 1, 1],
      [-1, 0, 1],
      [-1, -1, 0],
    ];

    this.matrixPrewittDiagonal2 = [
      [-1, -1, 0],
      [-1, 0, 1],
      [0, 1, 1],
    ];

    this.load();
  }

  load () {
    this.convolution = new Convolution();
    Prewitt.setAttribute("intensity", 1.0);
  }

  process (
    imageIn: MarvinImage,
    attrOut: MarvinAttributes,
    mask: MarvinImageMask,
    previewMode: boolean
  ) {
    const intensity = Prewitt.getAttribute("intensity");
    let imageOut = imageIn.clone(false);
    if (intensity == 1) {
      // console.log(
      //   "in R: " + imageIn.getIntComponent0(0, 0),
      //   " G: " + imageIn.getIntComponent1(0, 0),
      //   " B: " + imageIn.getIntComponent2(0, 0),
      //   "Alpha: " + imageIn.getAlphaComponent(0, 0)
      // );
      console.time("convolution X");
      Convolution.setAttribute("matrix", this.matrixPrewittX);
      imageOut = this.convolution.process(imageOut, this.matrixPrewittX);
      console.timeEnd("convolution X");
      console.time("convolution Y");
      Convolution.setAttribute("matrix", this.matrixPrewittY);
      imageOut = this.convolution.process(imageOut, this.matrixPrewittY);
      console.timeEnd("convolution Y");
      console.time("convolution Diagonal");
      Convolution.setAttribute("matrix", this.matrixPrewittDiagonal);
      imageOut = this.convolution.process(imageOut, this.matrixPrewittDiagonal);
      console.timeEnd("convolution Diagonal");
      console.time("convolution Diagonal2");
      Convolution.setAttribute("matrix", this.matrixPrewittDiagonal2);
      imageOut = this.convolution.process(imageOut, this.matrixPrewittDiagonal2);
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
        MarvinMath.scaleMatrix(this.matrixPrewittX, intensity)
      );
      imageOut = this.convolution.process(imageOut, this.matrixPrewittX);
      Convolution.setAttribute(
        "matrix",
        MarvinMath.scaleMatrix(this.matrixPrewittY, intensity)
      );
      imageOut = this.convolution.process(imageOut, this.matrixPrewittY);
    }
    return imageOut;
  }
}
