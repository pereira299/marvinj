import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";
export default class AlphaBoundary extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load() {
    this.setAttribute("radius", 5);
  };

  process(imageIn, imageOut, attributesOut, mask, previewMode) {
    var neighborhood = this.getAttribute("radius");
    for (var y = 0; y < imageOut.getHeight(); y++) {
      for (var x = 0; x < imageOut.getWidth(); x++) {
        this.alphaRadius(imageOut, x, y, neighborhood);
      }
    }
  };

  alphaRadius(image, x, y, radius) {
    var oldAlpha = image.getAlphaComponent(x, y);
    var newAlpha;
    var totalAlpha = 0;
    var totalPixels = 0;
    var hn = Math.floor(radius / 2);

    for (var j = y - hn; j < y + hn; j++) {
      for (var i = x - hn; i < x + hn; i++) {
        if (i >= 0 && i < image.getWidth() && j >= 0 && j < image.getHeight()) {
          totalAlpha += image.getAlphaComponent(i, j);
          totalPixels++;
        }
      }
    }

    newAlpha = Math.floor(totalAlpha / totalPixels);

    if (newAlpha < oldAlpha) image.setAlphaComponent(x, y, newAlpha);
  };
}
