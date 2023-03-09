import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class Crop extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load () {
    Crop.setAttribute("x", 0);
    Crop.setAttribute("y", 0);
    Crop.setAttribute("width", 0);
    Crop.setAttribute("height", 0);
  }

  process (imageIn, imageOut, attributesOut, mask, previewMode) {
    const x = Crop.getAttribute("x");
    const y = Crop.getAttribute("y");
    const width = Crop.getAttribute("width");
    const height = Crop.getAttribute("height");

    imageOut.setDimension(width, height);

    for (let i = x; i < x + width; i++) {
      for (let j = y; j < y + height; j++) {
        imageOut.setIntColor(i - x, j - y, imageIn.getIntColor(i, j));
      }
    }
  }
}
