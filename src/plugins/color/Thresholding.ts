import MarvinImage from "../../image/MarvinImage";
import MarvinImageMask from "../../image/MarvinImageMask";
import MarvinAttributes from "../../util/MarvinAttributes";
import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";
import GrayScale from "./GrayScale";

export default class Thresholding extends MarvinAbstractImagePlugin {
  threshold: number;
  thresholdRange: number;
  neighborhood: number;
  range: number;
  pluginGray: GrayScale;

  constructor() {
    super();
    this.load();
  }

  load() {
    // Attributes
    Thresholding.setAttribute("threshold", 125);
    Thresholding.setAttribute("thresholdRange", -1);
    Thresholding.setAttribute("neighborhood", -1);
    Thresholding.setAttribute("range", -1);

    this.pluginGray = new GrayScale();
  }

  process(
    imageIn: MarvinImage,
    attributesOut: MarvinAttributes,
    mask: MarvinImageMask,
    previewMode: boolean
  ) {
    this.threshold = Thresholding.getAttribute("threshold");
    this.thresholdRange = Thresholding.getAttribute("thresholdRange");
    this.neighborhood = Thresholding.getAttribute("neighborhood");
    this.range = Thresholding.getAttribute("range");

    if (this.thresholdRange == -1) {
      this.thresholdRange = 255 - this.threshold;
    }

    const imageOut = this.pluginGray.process(
      imageIn,
      attributesOut,
      mask,
      previewMode
    );

    const bmask = mask.getMask();

    if (this.neighborhood == -1 && this.range == -1) {
      return this.hardThreshold(imageIn, imageOut, bmask);
    } else {
      return this.contrastThreshold(imageIn, imageOut);
    }
  }

  hardThreshold(imageIn:MarvinImage, imageOut: MarvinImage, mask: boolean[][]) {
    for (let y = 0; y < imageIn.getHeight(); y++) {
      for (let x = 0; x < imageIn.getWidth(); x++) {
        if (mask != null && !mask[x][y]) {
          continue;
        }

        const gray = imageIn.getIntComponent0(x, y);
        if (
          gray < this.threshold ||
          gray > this.threshold + this.thresholdRange
        ) {
          imageOut.setIntColor(x, y, imageIn.getAlphaComponent(x, y), 0, 0, 0);
        } else {
          imageOut.setIntColor(
            x,
            y,
            imageIn.getAlphaComponent(x, y),
            255,
            255,
            255
          );
        }
      }
    }
    return imageOut;
  }

  contrastThreshold(imageIn: MarvinImage, imageOut: MarvinImage) {
    this.range = 1;
    for (let x = 0; x < imageIn.getWidth(); x++) {
      for (let y = 0; y < imageIn.getHeight(); y++) {
        if (
          this.checkNeighbors(x, y, this.neighborhood, this.neighborhood, imageIn)
        ) {
          imageOut.setIntColor(x, y, 0, 0, 0);
        } else {
          imageOut.setIntColor(x, y, 255, 255, 255);
        }
      }
    }
    return imageOut;
  }

  checkNeighbors(x, y, neighborhoodX, neighborhoodY, img) {
    let color;
    let z = 0;

    color = img.getIntComponent0(x, y);

    for (let i = 0 - neighborhoodX; i <= neighborhoodX; i++) {
      for (let j = 0 - neighborhoodY; j <= neighborhoodY; j++) {
        if (i == 0 && j == 0) {
          continue;
        }

        if (
          color < this.getSafeColor(x + i, y + j, img) - this.range &&
          this.getSafeColor(x + i, y + j, img) != -1
        ) {
          z++;
        }
      }
    }

    if (z > neighborhoodX * neighborhoodY * 0.5) {
      return true;
    }

    return false;
  }

  getSafeColor(x, y, img) {
    if (x >= 0 && x < img.getWidth() && y >= 0 && y < img.getHeight()) {
      return img.getIntComponent0(x, y);
    }
    return -1;
  }
}
