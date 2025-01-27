import MarvinImage from "../../image/MarvinImage";
import MarvinImageMask from "../../image/MarvinImageMask";
import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";
export default class AlphaBoundary extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }
  load() {
    AlphaBoundary.setAttribute("radius", 5);
  }
  process(imageOut:MarvinImage, attributesOut, mask: MarvinImageMask, previewMode: boolean) {
    const neighborhood = AlphaBoundary.getAttribute("radius");
    for (let y = 0; y < imageOut.getHeight(); y++) {
      for (let x = 0; x < imageOut.getWidth(); x++) {
        this.alphaRadius(imageOut, x, y, neighborhood);
      }
    }

    return imageOut;
  }
  alphaRadius(image:MarvinImage, x:number, y:number, radius:number) {
    const oldAlpha = image.getAlphaComponent(x, y);
    let newAlpha:number;
    let totalAlpha = 0;
    let totalPixels = 0;
    const hn = Math.floor(radius / 2);

    for (let j = y - hn; j < y + hn; j++) {
      for (let i = x - hn; i < x + hn; i++) {
        if (i >= 0 && i < image.getWidth() && j >= 0 && j < image.getHeight()) {
          totalAlpha += image.getAlphaComponent(i, j);
          totalPixels++;
        }
      }
    }

    newAlpha = Math.floor(totalAlpha / totalPixels);

    if (newAlpha < oldAlpha) image.setAlphaComponent(x, y, newAlpha);
  }
}
