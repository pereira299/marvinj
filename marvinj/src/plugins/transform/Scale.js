import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class Scale extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load = function () {
    // Attributes
    this.setAttribute("newWidth", 0);
    this.setAttribute("newHeight", 0);
  };

  process = function (imageIn, imageOut, attributesOut, mask, previewMode) {
    if (!previewMode) {
      let width = imageIn.getWidth();
      let height = imageIn.getHeight();
      let newWidth = this.getAttribute("newWidth");
      let newHeight = this.getAttribute("newHeight");

      if (
        imageOut.getWidth() != newWidth ||
        imageOut.getHeight() != newHeight
      ) {
        imageOut.setDimension(newWidth, newHeight);
      }

      let x_ratio = Math.floor((width << 16) / newWidth);
      let y_ratio = Math.floor((height << 16) / newHeight);
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
  };
}
