import MarvinImage from "../../image/MarvinImage";
import MarvinImageMask from "../../image/MarvinImageMask";
import MarvinAttributes from "../../util/MarvinAttributes";
import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class GrayScale extends MarvinAbstractImagePlugin {
  constructor() {
    super();
  }

  process(
    imageIn: MarvinImage,
    attributesOut: MarvinAttributes,
    mask: MarvinImageMask,
    previewMode: boolean
  ) {
    const imageOut = imageIn.clone();
    // Mask
    let l_arrMask;
    if (mask != null) {
      l_arrMask = mask.getMask();
    }

    l_arrMask = l_arrMask || new  MarvinImageMask(imageIn.getWidth(), imageIn.getHeight()).getMask();
    
    let r, g, b, finalColor;
    for (let x = 0; x < imageIn.getWidth(); x++) {
      for (let y = 0; y < imageIn.getHeight(); y++) {
        if (l_arrMask != null && !l_arrMask[x][y]) {
          continue;
        }
        //Red - 30% / Green - 59% / Blue - 11%
        r = imageIn.getIntComponent0(x, y);
        g = imageIn.getIntComponent1(x, y);
        b = imageIn.getIntComponent2(x, y);
        finalColor = Math.ceil(r * 0.3 + g * 0.59 + b * 0.11);
        imageOut.setIntColor(
          x,
          y,
          imageIn.getAlphaComponent(x, y),
          finalColor,
          finalColor,
          finalColor
        );
      }
    }

    return imageOut;
  }
}
