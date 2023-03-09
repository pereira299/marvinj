import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";
import MarvinJSUtils from "../../MarvinJSUtils";
export default class GaussianBlur extends MarvinAbstractImagePlugin {
  RED: number;
  GREEN: number;
  BLUE: number;
  kernelMatrix: number[][];
  resultMatrix: number[][][];
  appiledkernelMatrix: number[][];
  radius: number;

  constructor() {
    super();
    this.load();
  }

  load() {
    this.RED = 0;
    this.GREEN = 1;
    this.BLUE = 2;

    GaussianBlur.setAttribute("radius", 3);
  }

  process(imageIn, imageOut, attributesOut, mask, previewMode) {
    this.radius = GaussianBlur.getAttribute("radius");

    const l_imageWidth = imageIn.getWidth();
    const l_imageHeight = imageIn.getHeight();

    let l_pixelColor;
    this.kernelMatrix = this.getGaussianKernel();
    this.resultMatrix = MarvinJSUtils.createMatrix3D(
      l_imageWidth,
      l_imageHeight,
      3,
      0
    );
    this.appiledkernelMatrix = MarvinJSUtils.createMatrix2D(
      l_imageWidth,
      l_imageHeight,
      0
    );

    const l_arrMask = mask.getMask();

    for (let x = 0; x < l_imageWidth; x++) {
      for (let y = 0; y < l_imageHeight; y++) {
        if (l_arrMask != null && !l_arrMask[x][y]) {
          continue;
        }
        l_pixelColor = imageIn.getIntColor(x, y);
        this.applyKernel(x, y, l_pixelColor, imageOut);
      }
    }

    for (let x = 0; x < l_imageWidth; x++) {
      for (let y = 0; y < l_imageHeight; y++) {
        if (l_arrMask != null && !l_arrMask[x][y]) {
          continue;
        }
        this.resultMatrix[x][y][this.RED] =
          (this.resultMatrix[x][y][0] / this.appiledkernelMatrix[x][y]) % 256;
        this.resultMatrix[x][y][this.GREEN] =
          (this.resultMatrix[x][y][1] / this.appiledkernelMatrix[x][y]) % 256;
        this.resultMatrix[x][y][this.BLUE] =
          (this.resultMatrix[x][y][2] / this.appiledkernelMatrix[x][y]) % 256;
        imageOut.setIntColor(
          x,
          y,
          imageIn.getAlphaComponent(x, y),
          Math.floor(this.resultMatrix[x][y][0]),
          Math.floor(this.resultMatrix[x][y][1]),
          Math.floor(this.resultMatrix[x][y][2])
        );
      }
    }
  }

  /*
   * Calc Gaussian Matrix.
   */
  getGaussianKernel() {
    const l_matrix = MarvinJSUtils.createMatrix2D(
      this.radius * 2 + 1,
      this.radius * 2 + 1,
      0
    );
    const l_q = this.radius / 3.0;
    let l_distance;
    let l_x;
    let l_y;

    for (let x = 1; x <= this.radius * 2 + 1; x++) {
      for (let y = 1; y <= this.radius * 2 + 1; y++) {
        l_x = Math.abs(x - (this.radius + 1));
        l_y = Math.abs(y - (this.radius + 1));
        l_distance = Math.sqrt(l_x * l_x + l_y * l_y);
        l_matrix[y - 1][x - 1] =
          (1.0 / (2.0 * Math.PI * l_q * l_q)) *
          Math.exp(-(l_distance * l_distance) / (2.0 * l_q * l_q));
      }
    }
    return l_matrix;
  }

  /*
   * Apply the blur matrix on a image region.
   */
  applyKernel(centerPixel_X, centerPixel_Y, pixelColor, image) {
    for (let y = centerPixel_Y; y < centerPixel_Y + this.radius * 2; y++) {
      for (let x = centerPixel_X; x < centerPixel_X + this.radius * 2; x++) {
        if (
          x - this.radius >= 0 &&
          x - this.radius < image.getWidth() &&
          y - this.radius >= 0 &&
          y - this.radius < image.getHeight()
        ) {
          this.resultMatrix[x - this.radius][y - this.radius][this.RED] +=
            ((pixelColor & 0x00ff0000) >>> 16) *
            this.kernelMatrix[x - centerPixel_X][y - centerPixel_Y];
          this.resultMatrix[x - this.radius][y - this.radius][this.GREEN] +=
            ((pixelColor & 0x0000ff00) >>> 8) *
            this.kernelMatrix[x - centerPixel_X][y - centerPixel_Y];
          this.resultMatrix[x - this.radius][y - this.radius][this.BLUE] +=
            (pixelColor & 0x000000ff) *
            this.kernelMatrix[x - centerPixel_X][y - centerPixel_Y];
          this.appiledkernelMatrix[x - this.radius][y - this.radius] +=
            this.kernelMatrix[x - centerPixel_X][y - centerPixel_Y];
        }
      }
    }
  }
}
