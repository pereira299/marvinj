import MarvinMath from "../../math/MarvinMath";
import Convolution from "../convolution/Convolution";
import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class Prewitt extends MarvinAbstractImagePlugin {

  matrixPrewittX: number[][];
  matrixPrewittY: number[][];
  convolution: Convolution;
  previewMode: boolean = false;

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

    this.load();
  }

  load () {
    this.convolution = new Convolution();
    Prewitt.setAttribute("intensity", 1.0);
  }

  process (imageIn, imageOut, attrOut, mask, previewMode) {
    const intensity = Prewitt.getAttribute("intensity");

    if (intensity == 1) {
      Convolution.setAttribute("matrix", this.matrixPrewittX);
      this.convolution.process(imageIn, imageOut, null, mask, this.previewMode);
      Convolution.setAttribute("matrix", this.matrixPrewittY);
      this.convolution.process(imageIn, imageOut, null, mask, this.previewMode);
    } else {
      Convolution.setAttribute(
        "matrix",
        MarvinMath.scaleMatrix(this.matrixPrewittX, intensity)
      );
      this.convolution.process(imageIn, imageOut, null, mask, previewMode);
      Convolution.setAttribute(
        "matrix",
        MarvinMath.scaleMatrix(this.matrixPrewittY, intensity)
      );
      this.convolution.process(imageIn, imageOut, null, mask, previewMode);
    }
  }
}
