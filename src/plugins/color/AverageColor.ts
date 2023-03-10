import MarvinImage from "../../image/MarvinImage";
import MarvinImageMask from "../../image/MarvinImageMask";
import MarvinAttributes from "../../util/MarvinAttributes";
import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class AverageColor extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }
  load() {}
  process(
    imageIn: MarvinImage,
    attributesOut: MarvinAttributes,
    mask: MarvinImageMask,
    previewMode: boolean
  ) {
    let totalR = 0;
    let totalG = 0;
    let totalB = 0;

    for (let x = 0; x < imageIn.getWidth(); x++) {
      for (let y = 0; y < imageIn.getHeight(); y++) {
        totalR += imageIn.getIntComponent0(x, y);
        totalG += imageIn.getIntComponent1(x, y);
        totalB += imageIn.getIntComponent2(x, y);
      }
    }

    const totalPixels = imageIn.getWidth() * imageIn.getHeight();
    totalR = Math.round(totalR / totalPixels);
    totalG = Math.round(totalG / totalPixels);
    totalB = Math.round(totalB / totalPixels);

    if (attributesOut != null) {
      attributesOut.set("averageColor", [totalR, totalG, totalB]);
    }
  }
}
