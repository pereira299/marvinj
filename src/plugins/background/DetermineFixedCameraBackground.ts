import MarvinImage from "../../image/MarvinImage";
import MarvinImageMask from "../../image/MarvinImageMask";
import MarvinJSUtils from "../../MarvinJSUtils";
import MarvinAttributes from "../../util/MarvinAttributes";
import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";
export default class DetermineFixedCameraBackground extends MarvinAbstractImagePlugin {
  
  initialized: boolean;
  weights: number[][][][];

  constructor() {
    super();
    this.load();
  }

  load() {
    this.initialized = false;
  }

  initialize(imageIn) {
    this.weights = this.weights = MarvinJSUtils.createMatrix4D(
      imageIn.getWidth(),
      imageIn.getHeight(),
      3,
      26,
      0
    );
    this.initialized = true;
  }

  process(
    imageIn: MarvinImage,
    attributesOut: MarvinAttributes,
    mask: MarvinImageMask,
    previewMode: boolean
  ) {
    if (!this.initialized) {
      this.initialize(imageIn);
    }

    let imageOut = imageIn.clone();

    for (let y = 0; y < imageIn.getHeight(); y++) {
      for (let x = 0; x < imageIn.getWidth(); x++) {
        const red = imageIn.getIntComponent0(x, y);
        const green = imageIn.getIntComponent1(x, y);
        const blue = imageIn.getIntComponent2(x, y);

        this.weights[x][y][0][red / 10]++;
        this.weights[x][y][1][green / 10]++;
        this.weights[x][y][2][blue / 10]++;

        imageOut = imageOut.setIntColor(
          x,
          y,
          255,
          this.getProbableColor(this.weights[x][y][0]),
          this.getProbableColor(this.weights[x][y][1]),
          this.getProbableColor(this.weights[x][y][2])
        );
      }
    }
  }

  getProbableColor(arr) {
    let max = -1;
    let maxIndex = 0;

    for (let i = 0; i < arr.length; i++) {
      if (max == -1 || arr[i] > max) {
        max = arr[i];
        maxIndex = i;
      }
    }

    return maxIndex * 10;
  }
}
