import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class Crop extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load = function () {
    this.setAttribute("x", 0);
    this.setAttribute("y", 0);
    this.setAttribute("width", 0);
    this.setAttribute("height", 0);
  };

  process = function (imageIn, imageOut, attributesOut, mask, previewMode) {
    var x = this.getAttribute("x");
    var y = this.getAttribute("y");
    var width = this.getAttribute("width");
    var height = this.getAttribute("height");

    imageOut.setDimension(width, height);

    for (var i = x; i < x + width; i++) {
      for (var j = y; j < y + height; j++) {
        imageOut.setIntColor(i - x, j - y, imageIn.getIntColor(i, j));
      }
    }
  };
}
