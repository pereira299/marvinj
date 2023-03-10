import MarvinImage from "../../image/MarvinImage";
import MarvinImageMask from "../../image/MarvinImageMask";
import MarvinAttributes from "../../util/MarvinAttributes";
import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class Scale extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load () {
    // Attributes
    Scale.setAttribute("newWidth", 0);
    Scale.setAttribute("newHeight", 0);
  }

  process (
    imageIn: MarvinImage,
    attributesOut: MarvinAttributes,
    mask: MarvinImageMask,
    previewMode: boolean
  ) {
    const imageOut = imageIn.clone();
    if (!previewMode) {
      const width = imageIn.getWidth();
      const height = imageIn.getHeight();
      const newWidth = Scale.getAttribute("newWidth");
      const newHeight = Scale.getAttribute("newHeight");

      if (
        imageOut.getWidth() != newWidth ||
        imageOut.getHeight() != newHeight
      ) {
        imageOut.setDimension(newWidth, newHeight);
      }

      const x_ratio = Math.floor((width << 16) / newWidth);
      const y_ratio = Math.floor((height << 16) / newHeight);
      let x2, y2;
      for (let i = 0; i < newHeight; i++) {
        for (let j = 0; j < newWidth; j++) {
          x2 = Math.floor((j * x_ratio) >> 16);
          y2 = Math.floor((i * y_ratio) >> 16);
          imageOut.setIntColor(
            j,
            i,
            imageIn.getAlphaComponent(x2, y2),
            imageIn.getIntColor(x2, y2)
          );
        }
      }
    }
    return imageOut;
  }
}
