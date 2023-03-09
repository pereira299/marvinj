import MarvinJSUtils from "../../MarvinJSUtils.js";
import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin.js";
export default class DetermineFixedCameraBackground extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load() {
	this.utils = new MarvinJSUtils();
    this.initialized = false;
  }

  initialize(imageIn) {
    this.weights = this.weights = this.utils.createMatrix4D(
      imageIn.getWidth(),
      imageIn.getHeight(),
      3,
      26,
      0
    );
    initialized = true;
  }

  process(imageIn, imageOut, attributesOut, mask, previewMode) {
    if (!this.initialized) {
      this.initialize(imageIn);
    }

    for (let y = 0; y < imageIn.getHeight(); y++) {
      for (let x = 0; x < imageIn.getWidth(); x++) {
        let red = imageIn.getIntComponent0(x, y);
        let green = imageIn.getIntComponent1(x, y);
        let blue = imageIn.getIntComponent2(x, y);

        weights[x][y][0][red / 10]++;
        weights[x][y][1][green / 10]++;
        weights[x][y][2][blue / 10]++;

        imageOut.setIntColor(
          x,
          y,
          255,
          this.getProbableColor(weights[x][y][0]),
          this.getProbableColor(weights[x][y][1]),
          this.getProbableColor(weights[x][y][2])
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
