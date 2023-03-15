import MarvinImage from "../../image/MarvinImage";
import MarvinImageMask from "../../image/MarvinImageMask";
import MarvinAttributes from "../../util/MarvinAttributes";
import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";
import GrayScale from "./GrayScale";

export default class Thresholding extends MarvinAbstractImagePlugin {
  private attributes: MarvinAttributes;
  private threshold: number;
  private pluginGray: GrayScale;

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

    const imageOut = this.pluginGray.process(
      imageIn,
      attributesOut,
      mask,
      previewMode
    );

    const l_arrMask: boolean[][] = mask.arrMask;

    for (let y = 0; y < imageIn.getHeight(); y++) {
      for (let x = 0; x < imageIn.getWidth(); x++) {
        if (l_arrMask != null && !l_arrMask[x][y]) {
          continue;
        }

        if (imageIn.getIntComponent0(x, y) < this.threshold) {
          imageOut.setIntColor(x, y, 0, 0, 0);
        } else {
          imageOut.setIntColor(x, y, 255, 255, 255);
        }
      }
    }

    return imageOut;
  }
}
